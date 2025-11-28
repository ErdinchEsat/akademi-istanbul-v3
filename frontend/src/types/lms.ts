export interface Category {
    id: number;
    name: string;
    slug: string;
    parent?: number;
    icon?: string;
}

export interface Lesson {
    id: number;
    title: string;
    order: number;
    resourcetype: 'VideoLesson' | 'DocumentLesson' | 'QuizLesson' | 'HTMLLesson' | 'LiveLesson' | 'Assignment';
    is_preview?: boolean;
    // VideoLesson specific
    video_url?: string;
    duration?: string;
    processing_status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    source_file?: File; // For upload only
    source_file_url?: string; // URL from backend for uploaded videos
    // DocumentLesson specific (PDF, DOCX, XLSX)
    file?: string | File;  // URL for display, File for upload
    file_url?: string;  // Full URL from backend
    file_type?: string;  // 'pdf' | 'docx' | 'xlsx' | etc
    file_size?: number;  // In bytes
    // QuizLesson specific
    passing_score?: number;
    duration_minutes?: number;
    questions?: any[]; // Define Question type if needed
    // HTMLLesson specific
    content?: string;
    // LiveLesson specific
    start_time?: string;
    end_time?: string;
    meeting_link?: string;
    recording_url?: string;
    // Assignment specific
    due_date?: string;
    points?: number;
    file_submission_required?: boolean;
}

export interface Module {
    id?: number;
    title: string;
    description?: string;
    order: number;
    course?: number;
    lessons?: Lesson[];
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    category: number | Category; // ID or object depending on endpoint
    description: string;
    image?: string | File; // URL or File for upload
    instructor?: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
    };
    is_published: boolean;
    created_at: string;
    updated_at: string;
    modules?: Module[];
    // Computed fields from backend
    total_modules?: number;
    total_duration?: string;
}

export interface CourseCreateData {
    title: string;
    category: number;
    description: string;
    image?: File;
    is_published: boolean;
}
