'use server'

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Enrollment, { serializeEnrollment } from '@/models/Enrollment';
import Course, { serializeCourse } from '@/models/Course';
import { getCurrentUser } from './user';
import UserProfile from '@/models/UserProfile';




// Enroll a student in a course
export async function enrollInCourse(courseId: string, userId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && userId) {
            id = userId;
        }

        await connectToDatabase();

        // Check if enrollment already exists
        const existingEnrollment = await Enrollment.findOne({ userId: id, courseId });

        if (existingEnrollment) {
            return { success: false, error: 'Already enrolled in this course' };
        }

        // Check if course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            userId: id,
            courseId,
            enrollmentDate: new Date(),
            completedChapters: [],
            isCompleted: false
        });

        revalidatePath(`/courses/${courseId}`);
        revalidatePath(`/dashboard/courses`);

        return { success: true, enrollment: serializeEnrollment(enrollment) };
    } catch (error: any) {
        console.error('Error enrolling in course:', error);
        return { success: false, error: error.message };
    }
}

// Enroll a student From backend
export async function enrollInCourseFromBackend(courseId: string, userId: string) {
    try {

        await connectToDatabase();

        // Check if enrollment already exists
        const existingEnrollment = await Enrollment.findOne({ userId: userId, courseId });

        if (existingEnrollment) {
            return { success: false, error: 'Already enrolled in this course' };
        }

        // Check if course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            userId: userId,
            courseId,
            enrollmentDate: new Date(),
            completedChapters: [],
            isCompleted: false
        });

        revalidatePath(`/courses/${courseId}`);
        revalidatePath(`/dashboard/courses`);

        return { success: true, enrollment: serializeEnrollment(enrollment) };
    } catch (error: any) {
        console.error('Error enrolling in course:', error);
        return { success: false, error: error.message };
    }
}

// Unenroll a student from a course
export async function unenrollFromCourse(courseId: string, userId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && userId) {
            id = userId;
        }
        await connectToDatabase();

        const enrollment = await Enrollment.findOneAndDelete({ userId: id, courseId });

        if (!enrollment) {
            return { success: false, error: 'Enrollment not found' };
        }

        revalidatePath(`/courses/${courseId}`);
        revalidatePath(`/dashboard/courses`);

        return { success: true };
    } catch (error: any) {
        console.error('Error unenrolling from course:', error);
        return { success: false, error: error.message };
    }
}

// Mark a chapter as completed
export async function markChapterCompleted(courseId: string, chapterId: string, userId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && userId) {
            id = userId;
        }
        await connectToDatabase();

        const enrollment = await Enrollment.findOne({ userId: id, courseId });

        if (!enrollment) {
            return { success: false, error: 'Not enrolled in this course' };
        }

        // Add chapter to completed chapters if not already completed
        if (!enrollment.completedChapters.includes(chapterId)) {
            enrollment.completedChapters.push(chapterId);
            await enrollment.save();
        }

        revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);

        return { success: true, enrollment: serializeEnrollment(enrollment) };
    } catch (error: any) {
        console.error('Error marking chapter as completed:', error);
        return { success: false, error: error.message };
    }
}

// Get all courses a student is enrolled in
export async function getEnrolledCourses(userId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && userId) {
            id = userId;
        }
        await connectToDatabase();
        console.log("getEnrolledCourses", { userId: id });

        const enrollments = await Enrollment.find({ userId: id });
        console.log("getEnrolledCourses", { enrollments });


        const courseIds = enrollments.map(enrollment => enrollment.courseId);

        const courses = await Course.find({
            _id: { $in: courseIds },
            isPublished: true
        }).lean();
        console.log("getEnrolledCourses", { courses });

        return { success: true, courses: courses.map(ch => serializeCourse(ch)) };
    } catch (error: any) {
        console.error('Error getting enrolled courses:', error);
        return { success: false, error: error.message };
    }
}

// Get course progress for a student
export async function getCourseProgress(courseId: string, userId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && userId) {
            id = userId;
        }
        await connectToDatabase();

        const enrollment = await Enrollment.findOne({ userId: id, courseId });

        if (!enrollment) {
            return { success: false, error: 'Not enrolled in this course' };
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        const completedChapters: string[] = enrollment.completedChapters;
        const totalChapters = course.chapters.filter(chapter => chapter.isPublished).length;

        const progressPercentage = totalChapters > 0
            ? Math.round((completedChapters.length / totalChapters) * 100)
            : 0;

        return {
            success: true,
            progress: {
                completedChapters,
                totalChapters,
                progressPercentage,
                isCompleted: enrollment.isCompleted
            }
        };
    } catch (error: any) {
        console.error('Error getting course progress:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Check if a user is enrolled in a specific course
 */
export async function checkEnrollment(courseId: string, userId: string) {
    try {
        await connectToDatabase();

        const enrollment = await Enrollment.findOne({
            userId,
            courseId
        });

        return !!enrollment;
    } catch (error) {
        console.error("Error checking enrollment:", error);
        return false;
    }
}

// Get all students enrolled in an instructor's courses
export async function getEnrolledStudents(instructorId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // First, fetch all courses by this instructor
        const courses = await Course.find({ instructorId: id }).lean();


        if (!courses.length) {
            return { success: true, students: [], courseEnrollments: {} };
        }

        // Get the course IDs
        const courseIds = courses.map(course => course._id.toString());

        // Find all enrollments for these courses
        const enrollments = await Enrollment.find({ courseId: { $in: courseIds } }).lean();

        if (!enrollments.length) {
            return { success: true, students: [], courseEnrollments: {} };
        }

        // Get unique student IDs
        const studentIds = [...Array.from(new Set(enrollments.map(enrollment => enrollment.userId)))];

        // Fetch student details
        const students = await UserProfile.find({ _id: { $in: studentIds } }).lean();

        // Create a map of student information
        const studentDetails = students.reduce((acc, student) => {
            acc[student._id.toString()] = {
                id: student._id.toString(),
                auth0Id: student.auth0Id,
                name: student.name,
                email: student.email,
                picture: student.picture,
                enrollments: []
            };
            return acc;
        }, {} as Record<string, { id: string, auth0Id: string, name: string, email: string, picture?: string, enrollments: any[] }>);

        // Create a map of course enrollments
        const courseEnrollments = {} as Record<string, {
            studentId: string;
            auth0Id: string;
            name: string;
            email: string;
            picture?: string;
            enrollmentDate: Date;
            completedChapters: string[];
            isCompleted: boolean;
            progress: number;
        }[]>;

        // Enrich each enrollment with course and student details
        enrollments.forEach(enrollment => {
            const courseId = enrollment.courseId;
            const userId = enrollment.userId;

            // Add course to student enrollments
            if (studentDetails[userId]) {
                const course = courses.find(c => c._id.toString() === courseId);

                if (course) {
                    studentDetails[userId].enrollments.push({
                        courseId,
                        courseTitle: course.title,
                        enrollmentDate: enrollment.enrollmentDate,
                        completedChapters: enrollment.completedChapters || [],
                        isCompleted: enrollment.isCompleted || false,
                        progress: course.chapters && course.chapters.length > 0
                            ? Math.round(((enrollment.completedChapters?.length || 0) / course.chapters.length) * 100)
                            : 0
                    });
                }

                // Initialize course enrollment array if needed
                if (!courseEnrollments[courseId]) {
                    courseEnrollments[courseId] = [];
                }

                // Add student to course enrollments
                if (studentDetails[userId]) {
                    courseEnrollments[courseId].push({
                        studentId: studentDetails[userId].id,
                        auth0Id: userId,
                        name: studentDetails[userId].name,
                        email: studentDetails[userId].email,
                        picture: studentDetails[userId].picture,
                        enrollmentDate: enrollment.enrollmentDate,
                        completedChapters: enrollment.completedChapters || [],
                        isCompleted: enrollment.isCompleted || false,
                        progress: course && course.chapters && course.chapters.length > 0
                            ? Math.round(((enrollment.completedChapters?.length || 0) / course.chapters.length) * 100)
                            : 0
                    });
                }
            }
        });

        // Convert the map to an array of students
        const enrolledStudents = Object.values(studentDetails);

        return {
            success: true,
            students: enrolledStudents,
            courseEnrollments
        };
    } catch (error: any) {
        console.error('Error getting enrolled students:', error);
        return { success: false, error: error.message };
    }
}

// Get average completion percentage across all courses
export async function getAverageCompletionRate(instructorId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Get all courses by this instructor
        const courses = await Course.find({ instructorId: id }).lean();

        if (!courses.length) {
            return { success: true, averageCompletionRate: 0 };
        }

        // Get the course IDs
        const courseIds = courses.map(course => course._id.toString());

        // Get all enrollments for these courses
        const enrollments = await Enrollment.find({ courseId: { $in: courseIds } }).lean();

        if (!enrollments.length) {
            return { success: true, averageCompletionRate: 0 };
        }

        // Calculate completion rate for each enrollment
        let totalCompletion = 0;
        let validEnrollments = 0;

        for (const enrollment of enrollments) {
            const course = courses.find(c => c._id.toString() === enrollment.courseId);

            if (course && course.chapters && course.chapters.length > 0) {
                const completedChapters = enrollment.completedChapters?.length || 0;
                const totalChapters = course.chapters.length;
                const completionRate = (completedChapters / totalChapters) * 100;

                totalCompletion += completionRate;
                validEnrollments++;
            }
        }

        // Calculate average
        const averageCompletionRate = validEnrollments > 0
            ? Math.round(totalCompletion / validEnrollments)
            : 0;

        return { success: true, averageCompletionRate };
    } catch (error: any) {
        console.error('Error calculating average completion rate:', error);
        return { success: false, error: error.message };
    }
}

// Get active students count (students with activity in last 30 days)
export async function getActiveStudentsCount(instructorId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Get 30 days ago date
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get all courses by this instructor
        const courses = await Course.find({ instructorId: id }).lean();

        if (!courses.length) {
            return { success: true, activeStudents: 0, totalStudents: 0 };
        }

        // Get the course IDs
        const courseIds = courses.map(course => course._id.toString());

        // Find all enrollments for these courses
        const enrollments = await Enrollment.find({
            courseId: { $in: courseIds },
            updatedAt: { $gte: thirtyDaysAgo }
        }).lean();

        // Count unique student IDs
        const uniqueActiveStudentIds = new Set(enrollments.map(e => e.userId));

        // Get total students (not just active)
        const allEnrollments = await Enrollment.find({
            courseId: { $in: courseIds }
        }).lean();

        const uniqueStudentIds = new Set(allEnrollments.map(e => e.userId));

        return {
            success: true,
            activeStudents: uniqueActiveStudentIds.size,
            totalStudents: uniqueStudentIds.size
        };
    } catch (error: any) {
        console.error('Error getting active students count:', error);
        return { success: false, error: error.message };
    }
}
