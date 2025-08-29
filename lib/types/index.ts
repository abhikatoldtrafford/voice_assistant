export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  instructorId: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'completed' | 'dropped';
  progress: number;
  enrolledAt: Date;
  completedAt?: Date;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  chapterId: string;
  completed: boolean;
  lastAccessed: Date;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}