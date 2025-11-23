export interface QuizQuestion {
    id: number;
    text: string;
    options: string[];
    correctOption: number;
}

export interface CourseModule {
    id: number;
    title: string;
    duration: string;
    type: 'video' | 'quiz' | 'document' | 'live';
    isCompleted: boolean;
    quizData?: QuizQuestion[];
}

export interface Course {
    id: string;
    title: string;
    tenantId: string;
    category: string;
    imageUrl: string;
    progress?: number;
    instructor: string;
    totalModules: number;
    completedModules: number;
    rating: number;
    isLive?: boolean;
    nextLiveDate?: string;
    description?: string;
    modules?: CourseModule[];
}
