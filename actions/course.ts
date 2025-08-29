'use server'
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path as needed
import Course, { CourseData, IChapter, IChapterData, serializeChapters, serializeChapterSnapshots, serializeCourse } from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import { getCurrentUser } from './user';
import { Types } from 'mongoose';
import { toStringId } from '@/lib/utils';
import UserProfile, { IUserProfile, IUserProfileData } from '@/models/UserProfile';
import { ObjectId } from 'mongodb';



export async function createCourse(data: Omit<Omit<CourseData, 'instructorId'>, '_id'>) {
    try {
        let user = await getCurrentUser();

        // Connect to MongoDB
        await connectToDatabase();

        // Convert price from string to number
        const priceAsNumber = data.price;

        if (isNaN(priceAsNumber)) {
            throw new Error('Invalid price format');
        }

        // Create a new course in the database
        const newCourse = await Course.create({
            ...data,
            price: priceAsNumber,
            instructorId: user._id,
            reviewStatus: 'draft' // Initial status is draft
        });

        // Revalidate the courses page to update the UI
        revalidatePath('/instructor/courses');

        return { success: true, courseId: toStringId(newCourse._id) };
    } catch (error: any) {
        console.error('Error creating course:', error);
        return { success: false, error: error.message };
    }
}

// Get all courses for an instructor
export async function getInstructorCourses(instructorId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        // Connect to MongoDB
        await connectToDatabase();

        // Use lean() to get plain JavaScript objects
        const courses = await Course.find({ instructorId: id })
            .sort({ createdAt: -1 }) // Newest first
            .select('title imageUrl price isPublished reviewStatus reviewComment reviewDate chapters createdAt')
            .lean();

        // Get enrollment counts for each course
        const courseIds = courses.map(course => toStringId(course._id));

        // Use aggregation to count enrollments for each course
        const enrollmentCounts = await Enrollment.aggregate([
            { $match: { courseId: { $in: courseIds } } },
            { $group: { _id: "$courseId", count: { $sum: 1 } } }
        ]);

        // Create a map of course ID to enrollment count
        const enrollmentMap = enrollmentCounts.reduce((map, item) => {
            map[item._id] = item.count;
            return map;
        }, {} as Record<string, number>);

        // Transform the data to include the chapters count and enrollment count
        const formattedCourses = courses.map(course => {
            const courseId = toStringId(course._id);
            return {
                _id: courseId,
                title: course.title,
                price: course.price,
                imageUrl: course.imageUrl,
                isPublished: course.isPublished,
                reviewStatus: course.reviewStatus || 'draft',
                reviewComment: course.reviewComment,
                reviewDate: course.reviewDate,
                chapters: Array.isArray(course.chapters) ? course.chapters.length : 0,
                students: enrollmentMap[courseId] || 0, // Get count from map or default to 0
                createdAt: course.createdAt
            };
        });

        return { success: true, courses: formattedCourses };
    } catch (error: any) {
        console.error('Error fetching instructor courses:', error);
        return { success: false, error: error.message };
    }
}

// Get a single course by ID with student count
export async function getCourseByIdWithStudents(courseId: string, instructorId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Use lean() to get a plain JavaScript object
        const course = await Course.findOne({
            _id: courseId,
            instructorId: id
        }).lean();

        if (!course) {
            throw new Error('Course not found');
        }

        // Count students enrolled in this course
        const studentCount = await Enrollment.countDocuments({ courseId });

        // Serialize the course object
        const serializedCourse = {
            ...course,
            _id: toStringId(course._id),
            instructorId: toStringId(course.instructorId),
            chapters: serializeChapters(course.chapters),
            students: studentCount
        };

        return { success: true, course: serializedCourse };
    } catch (error: any) {
        console.error('Error fetching course:', error);
        return { success: false, error: error.message };
    }
}

// Get a single course by ID
export async function getCourseById(courseId: string, instructorId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Use lean() to get a plain JavaScript object
        const course = await Course.findOne({
            _id: courseId,
            instructorId: id
        }).lean();

        if (!course) {
            throw new Error('Course not found');
        }

        // Serialize the course object
        const serializedCourse: CourseData = {
            ...course,
            _id: toStringId(course._id),
            instructorId: toStringId(course.instructorId),
            chapters: serializeChapters(course.chapters),
            reviewerId: course.reviewerId ? toStringId(course.reviewerId) : undefined,
        };

        return { success: true, course: serializedCourse };
    } catch (error: any) {
        console.error('Error fetching course:', error);
        return { success: false, error: error.message };
    }
}
// Get a single Live course by ID
export async function getLiveCourseById(courseId: string, instructorId?: string) {
    try {
        let user = await getCurrentUser();


        await connectToDatabase();
        if (!user.roles.includes('admin')) {
            const enrollment = await Enrollment.findOne({ courseId: courseId, userId: user._id });
            if (!enrollment) {
                throw new Error('You do not have permission to access this course');
            }
        }
        // Use lean() to get a plain JavaScript object
        // console.log({ courseId });

        const course = await Course.findOne({
            _id: courseId,
            isPublished: true,
        }).lean();
        // console.log({ course });
        if (!course) {
            throw new Error('Course not found');
        }

        // Serialize the course object
        const serializedCourse: CourseData = {
            ...course,
            _id: toStringId(course._id),
            instructorId: toStringId(course.instructorId),
            chapters: course.publicVersion ? serializeChapterSnapshots(course.publicVersion?.chapters) : serializeChapters(course.chapters),
            reviewerId: course.reviewerId ? toStringId(course.reviewerId) : undefined,
        };

        return { success: true, course: serializedCourse };
    } catch (error: any) {
        console.error('Error fetching course:', error);
        return { success: false, error: error.message };
    }
}

// Update a course
export async function updateCourse(courseId: string, data: Partial<CourseData>, instructorId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Handle price conversion if it's being updated
        let updateData: any = { ...data };

        if (data.price) {
            const priceAsNumber = data.price;
            if (isNaN(priceAsNumber)) {
                throw new Error('Invalid price format');
            }
            updateData.price = priceAsNumber;
        }

        // Remove instructorId from update data if present
        if (updateData.instructorId) {
            delete updateData.instructorId;
        }

        // If course is already approved or pending, changing it sets status back to draft
        // unless the user is an admin
        const currentCourse = await Course.findOne({ _id: courseId });
        if (currentCourse &&
            (currentCourse.reviewStatus === 'approved' || currentCourse.reviewStatus === 'pending') &&
            !user.roles.includes('admin')) {
            updateData.reviewStatus = 'draft';
        }

        // Use findOneAndUpdate with lean() option
        const course = await Course.findOneAndUpdate(
            { _id: courseId, instructorId: id },
            { $set: updateData },
            { new: true, lean: true }
        );

        if (!course) {
            throw new Error('Course not found or you do not have permission to update it');
        }

        // Serialize the course object
        const serializedCourse = serializeCourse(course);

        revalidatePath(`/instructor/courses/${courseId}`);
        revalidatePath('/instructor/courses');

        return { success: true, course: serializedCourse };
    } catch (error: any) {
        console.error('Error updating course:', error);
        return { success: false, error: error.message };
    }
}
// Delete a course
export async function deleteCourse(courseId: string, instructorId?: string) {
    try {
        let user = await getCurrentUser();

        let id = user._id.toString();
        if (user.roles.includes('admin') && instructorId) {
            id = instructorId;
        }

        await connectToDatabase();

        // Use findOneAndDelete with lean() option
        const course = await Course.findOneAndDelete({
            _id: courseId,
            instructorId: id
        }).lean();

        if (!course) {
            throw new Error('Course not found or you do not have permission to delete it');
        }

        revalidatePath('/instructor/courses');

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting course:', error);
        return { success: false, error: error.message };
    }
}

// Publish/unpublish a course
export async function toggleCoursePublish(courseId: string, isPublish: boolean): Promise<
    { success: false, error: string }
    | { success: true, course: CourseData }
> {
    try {
        let user = await getCurrentUser();

        let id = user._id;

        await connectToDatabase();

        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        // For admin users, they can publish/unpublish directly
        if (user.roles.includes('admin')) {

            if (!course) {
                throw new Error('Course not found');
            }

            // If admin is publishing, update publicVersion and set status to approved
            if (isPublish) {
                // Update public version with current content
                course.publicVersion = {
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    level: course.level,
                    price: course.price,
                    imageUrl: course.imageUrl,
                    chapters: course.chapters.map(ch => ({
                        _id: ch._id.toString(),
                        title: ch.title,
                        content: ch.content,
                        videoUrl: ch.videoUrl,
                        position: ch.position,
                        isPublished: ch.isPublished
                    }))
                };

                course.isPublished = true;
                course.reviewStatus = 'approved';
                course.reviewDate = new Date();
                course.reviewerId = new ObjectId(user._id);
            } else {
                // Admin is unpublishing
                course.isPublished = false;
                // We keep the publicVersion for reference but it's not accessible to students
            }

            await course.save();
            const serializedCourse = serializeCourse(course.toJSON({ flattenObjectIds: true }));

            revalidatePath(`/instructor/courses/${courseId}`);
            revalidatePath('/instructor/courses');
            revalidatePath('/admin/courses');

            console.log(serializedCourse);

            return { success: true, course: serializedCourse };
        }
        // For instructors, they must go through review process
        else {
            //if id is not the instructor, then access is denied
            if (id !== course.instructorId.toString()) {
                throw new Error('You do not have permission to modify this course');
            }
            // If trying to publish, change to submitCourseForReview function
            if (isPublish) {
                return await submitCourseForReview(courseId);
            }
            // If unpublishing, they can do that directly
            else {
                throw 'instructor can not unpublish course';
                // for future use
                const course = await Course.findOneAndUpdate(
                    { _id: courseId, instructorId: id },
                    {
                        $set: {
                            isPublished: false,
                            reviewStatus: 'draft'
                        }
                    },
                    { new: true, lean: true }
                );

                if (!course) {
                    throw new Error('Course not found or you do not have permission to update it');
                }

                // Serialize the course object
                const serializedCourse = serializeCourse(course);

                revalidatePath(`/instructor/courses/${courseId}`);
                revalidatePath('/instructor/courses');

                return { success: true, course: serializedCourse };
            }
        }
    } catch (error: any) {
        console.error('Error toggling course publish status:', error);
        return { success: false, error: error.message as string };
    }
}
// get all the published courses
export async function getAllCourses() {
    try {
        await connectToDatabase();

        // Fetch only published and approved courses
        const courses = await Course.find({
            isPublished: true,
        }).lean();

        // For each course, fetch the instructor name
        const coursesWithInstructors = await Promise.all(
            courses.map(async (course) => {
                let instructorName = 'Instructor';

                try {
                    // Fetch instructor information
                    const instructor = await UserProfile.findById(course.instructorId).lean();
                    if (instructor) {
                        instructorName = instructor.name;
                    }
                } catch (error) {
                    console.error('Error fetching instructor:', error);
                }

                // Use publicVersion if available, otherwise use main course data
                const courseData = course.publicVersion || course;

                // Calculate course stats
                // In a real app, you would calculate this from actual data
                const totalStudents = Math.floor(Math.random() * 1000) + 50; // Random for demonstration
                const rating = (3.5 + Math.random() * 1.5).toFixed(1); // Random rating between 3.5 and 5.0

                return {
                    ...serializeCourse(course),
                    // Override with public version data if available
                    title: courseData.title,
                    description: courseData.description,
                    category: courseData.category,
                    level: courseData.level,
                    price: courseData.price,
                    imageUrl: courseData.imageUrl,
                    // Use public version chapters if available, otherwise use the main chapters
                    chapters: course.publicVersion ?
                        serializeChapterSnapshots(course.publicVersion.chapters) :
                        serializeChapters(course.chapters),
                    // Additional display data
                    instructorName,
                    totalStudents,
                    rating: parseFloat(rating),
                    // Estimate duration based on chapter count
                    duration: `${Math.max(1, Math.ceil((courseData.chapters?.length || 0) / 2))} weeks`,
                };
            })
        );

        return { success: true, courses: coursesWithInstructors };
    } catch (error: any) {
        console.error('Error fetching all courses:', error);
        return { success: false, error: error.message };
    }
}
// New function to get courses pending review for admin
export async function getPendingReviewCourses() {
    try {
        let user = await getCurrentUser();

        // Verify admin role
        if (!user.roles.includes('admin')) {
            throw new Error('You do not have permission to view courses pending review');
        }

        await connectToDatabase();

        // Find all courses with pending status
        const pendingCourses = await Course.find({
            reviewStatus: 'pending'
        }).populate('instructorId', 'name email').lean();

        // Get instructors info
        const coursesWithInstructors = pendingCourses.map(course => {
            const instructor = course.instructorId as any;

            return {
                ...serializeCourse(course),
                instructorName: instructor?.name || 'Unknown',
                instructorEmail: instructor?.email || 'No email'
            };
        });

        return { success: true, courses: coursesWithInstructors };
    } catch (error: any) {
        console.error('Error fetching pending review courses:', error);
        return { success: false, error: error.message };
    }
}

// Get all courses with review status filter
export async function getAllCoursesWithStatus(status?: 'draft' | 'pending' | 'approved' | 'rejected') {
    try {
        await connectToDatabase();

        // Prepare query object
        const query: any = { isPublished: true };

        // If status is provided, add it to the query
        if (status) {
            query.reviewStatus = status;
        }

        // Fetch courses based on the query
        const courses = await Course.find(query).populate('instructorId', 'name').lean();

        // For each course, fetch the instructor name
        const coursesWithInstructors = await Promise.all(
            courses.map(async (course) => {
                const instructor = course.instructorId as any;
                let instructorName = instructor?.name || 'Instructor';

                // Calculate course stats
                // In a real app, you would calculate this from actual data
                const totalStudents = Math.floor(Math.random() * 1000) + 50; // Random for demonstration
                const rating = (3.5 + Math.random() * 1.5).toFixed(1); // Random rating between 3.5 and 5.0

                return {
                    ...serializeCourse(course),
                    instructorName,
                    totalStudents,
                    rating: parseFloat(rating),
                    // Estimate duration based on chapter count
                    duration: `${Math.max(1, Math.ceil(course.chapters.length / 2))} weeks`,
                };
            })
        );

        return { success: true, courses: coursesWithInstructors };
    } catch (error: any) {
        console.error('Error fetching all courses:', error);
        return { success: false, error: error.message };
    }
}

export async function getPublicCourseById(courseId: string) {
    try {
        await connectToDatabase();

        // Fetch only if course is published and approved
        const course = await Course.findOne({
            _id: courseId,
            isPublished: true,
        }).lean();

        if (!course) {
            return { success: false, error: 'Course not found or not published' };
        }

        // If we have a publicVersion, use it instead of the main course data
        const courseData = serializeCourse(course);

        // Fetch instructor information
        let instructorName = 'Instructor';
        let instructor: IUserProfileData | undefined;
        try {
            instructor = (await UserProfile.findById(course.instructorId))?.toJSON({ flattenObjectIds: true }) as any;
            if (instructor) {
                instructorName = instructor.name;
            }
        } catch (error) {
            console.error('Error fetching instructor:', error);
        }

        // Calculate course stats
        // In a real app, you would calculate this from actual data
        const totalStudents = Math.floor(Math.random() * 1000) + 50;
        const rating = (3.5 + Math.random() * 1.5).toFixed(1);

        // Create a combined data structure
        // Use the public version data but keep the course metadata
        const serializedCourse = {
            ...courseData,
            // Override with public version data if available
            title: courseData.title,
            description: courseData.description,
            category: courseData.category,
            level: courseData.level,
            price: courseData.price,
            imageUrl: courseData.imageUrl,
            // Use public version chapters if available, otherwise use the main chapters
            chapters: course.publicVersion ? course.publicVersion.chapters : [],
            // Additional display data
            instructorName,
            instructor,
            totalStudents,
            rating: parseFloat(rating),
            duration: `${Math.max(1, Math.ceil((courseData.chapters?.length || 0) / 2))} weeks`,
        };

        return { success: true, course: serializedCourse };
    } catch (error: any) {
        console.error('Error fetching public course:', error);
        return { success: false, error: error.message };
    }
}


export async function submitCourseForReview(courseId: string): Promise<{ success: false, error: string } | { success: true, course: CourseData }> {
    try {
        let user = await getCurrentUser();

        await connectToDatabase();

        // Find the course and ensure it belongs to the instructor
        const course = await Course.findOne({
            _id: courseId,
            instructorId: user._id
        });

        if (!course) {
            throw new Error('Course not found or you do not have permission to modify it');
        }

        // If the course was previously approved and published,
        // the publicVersion will already be present and we keep it intact

        // Update review status to pending
        course.reviewStatus = 'pending';
        await course.save();

        revalidatePath(`/instructor/courses/${courseId}`);
        revalidatePath('/instructor/courses');

        return { success: true, course: serializeCourse(course.toJSON({ flattenObjectIds: true })) };
    } catch (error: any) {
        console.error('Error submitting course for review:', error);
        return { success: false, error: error.message };
    }
}

// New function - Admin approves a course
export async function approveCourse(courseId: string, comment?: string) {
    try {
        let admin = await getCurrentUser();

        // Verify admin role
        if (!admin.roles.includes('admin')) {
            throw new Error('You do not have permission to approve courses');
        }

        await connectToDatabase();

        const course = await Course.findById(courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        // Update public version with the current content
        course.publicVersion = {
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level,
            price: course.price,
            imageUrl: course.imageUrl,
            chapters: course.chapters.map(ch => ({
                _id: ch._id.toString(), // Convert ObjectId to string
                title: ch.title,
                content: ch.content,
                videoUrl: ch.videoUrl,
                position: ch.position,
                isPublished: ch.isPublished
            }))
        };

        // Update course status
        course.reviewStatus = 'approved';
        course.isPublished = true; // Also set as published
        course.reviewComment = comment || undefined;
        course.reviewDate = new Date();
        course.reviewerId = new ObjectId(admin._id);

        await course.save();

        revalidatePath(`/courses/${courseId}`);
        revalidatePath('/admin/courses');
        revalidatePath('/instructor/courses');

        return { success: true, course: serializeCourse(course.toJSON({ flattenObjectIds: true })) };
    } catch (error: any) {
        console.error('Error approving course:', error);
        return { success: false, error: error.message };
    }
}

// New function - Admin rejects a course
export async function rejectCourse(courseId: string, comment: string) {
    try {
        let admin = await getCurrentUser();

        // Verify admin role
        if (!admin.roles.includes('admin')) {
            throw new Error('You do not have permission to reject courses');
        }

        await connectToDatabase();

        const course = await Course.findById(courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        // Update course status
        course.reviewStatus = 'rejected';
        course.reviewComment = comment;
        course.reviewDate = new Date();
        course.reviewerId = new ObjectId(admin._id);

        // The publicVersion remains unchanged
        // This keeps the currently approved version available to students

        await course.save();

        revalidatePath(`/admin/courses`);
        revalidatePath('/instructor/courses');

        return { success: true, course: serializeCourse(course.toJSON({ flattenObjectIds: true })) };
    } catch (error: any) {
        console.error('Error rejecting course:', error);
        return { success: false, error: error.message };
    }
}