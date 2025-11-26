import axios from 'axios';
import { Course, Category, CourseCreateData, Module, Lesson } from '../types/lms';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Create axios instance with auth interceptor
const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const lmsService = {
    getCategories: async (): Promise<Category[]> => {
        const response = await api.get('/categories/');
        return response.data;
    },

    createCategory: async (name: string): Promise<Category> => {
        const response = await api.post('/categories/', {
            name
        });
        return response.data;
    },

    getCourses: async (params?: any): Promise<Course[]> => {
        const response = await api.get('/courses/', { params });
        return response.data;
    },

    getCourse: async (id: string | number): Promise<Course> => {
        const response = await api.get(`/courses/${id}/`);
        return response.data;
    },

    createCourse: async (data: CourseCreateData): Promise<Course> => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('category', data.category.toString());
        formData.append('description', data.description);
        formData.append('is_published', data.is_published.toString());
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await api.post('/courses/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateCourse: async (id: number, data: Partial<CourseCreateData>): Promise<Course> => {
        const formData = new FormData();
        if (data.title) formData.append('title', data.title);
        if (data.category) formData.append('category', data.category.toString());
        if (data.description) formData.append('description', data.description);
        if (data.is_published !== undefined) formData.append('is_published', data.is_published.toString());
        if (data.image) formData.append('image', data.image);

        const response = await api.patch(`/courses/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteCourse: async (id: number): Promise<void> => {
        await api.delete(`/courses/${id}/`);
    },

    createModule: async (courseId: number, data: Partial<Module>): Promise<Module> => {
        const response = await api.post('/modules/', { ...data, course: courseId });
        return response.data;
    },

    updateModule: async (id: number, data: Partial<Module>): Promise<Module> => {
        const response = await api.patch(`/modules/${id}/`, data);
        return response.data;
    },

    deleteModule: async (id: number): Promise<void> => {
        await api.delete(`/modules/${id}/`);
    },

    // Since we don't have a separate modules endpoint yet in views.py (it was nested or missing),
    // we might need to rely on nested creation or add the endpoint.
    // For now, let's assume we added ModuleViewSet or similar.
    // Wait, in previous steps I only added Category, Course, Lesson ViewSets.
    // I need to add ModuleViewSet to backend to make this work properly for granular creation.
    // Or use nested serializers.
    // Let's stick to the plan: I will add ModuleViewSet to backend if needed, or use what's available.
    // Checking backend views... I only have Category, Course, Lesson.
    // I should probably add ModuleViewSet to backend to make frontend life easier.
    // But for now let's define the service and I'll fix backend if needed.

    getMyCourses: async (): Promise<Course[]> => {
        const response = await api.get('/courses/my_courses/');
        return response.data;
    },

    createLesson: async (moduleId: number, data: Partial<Lesson>): Promise<Lesson> => {
        const formData = new FormData();
        formData.append('resourcetype', data.resourcetype!);
        formData.append('module', moduleId.toString());
        formData.append('title', data.title!);
        formData.append('order', (data.order || 1).toString());

        // VideoLesson
        if (data.resourcetype === 'VideoLesson') {
            if (data.source_file) formData.append('source_file', data.source_file);
            if (data.video_url) formData.append('video_url', data.video_url);
        }

        // PDFLesson
        if (data.resourcetype === 'PDFLesson' && data.file) {
            // Note: Backend expects 'file' field for PDFLesson
            // If data.file is a File object (upload), append it.
            // If it's a string (URL), append it too? Usually file upload expects file object.
            // But if we are just passing URL, backend FileField might not accept it unless it's a valid file path or we use a different field.
            // For now assume upload.
            formData.append('file', data.file);
        }

        // LiveLesson
        if (data.resourcetype === 'LiveLesson') {
            if (data.start_time) formData.append('start_time', data.start_time);
            if (data.end_time) formData.append('end_time', data.end_time);
            if (data.meeting_link) formData.append('meeting_link', data.meeting_link);
        }

        // Assignment
        if (data.resourcetype === 'Assignment') {
            if (data.due_date) formData.append('due_date', data.due_date);
            if (data.points) formData.append('points', data.points.toString());
            if (data.file_submission_required !== undefined) formData.append('file_submission_required', data.file_submission_required.toString());
        }

        // QuizLesson
        if (data.resourcetype === 'QuizLesson') {
            if (data.passing_score) formData.append('passing_score', data.passing_score.toString());
            if (data.duration_minutes) formData.append('duration_minutes', data.duration_minutes.toString());
            if (data.questions) formData.append('questions', JSON.stringify(data.questions));
        }

        // Common optional fields
        if (data.duration) formData.append('duration', data.duration);
        if (data.content) formData.append('content', data.content);

        const response = await api.post('/lessons/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteLesson: async (id: number): Promise<void> => {
        await api.delete(`/lessons/${id}/`);
    },

    updateLesson: async (id: number, data: Partial<Lesson>): Promise<Lesson> => {
        const formData = new FormData();
        if (data.resourcetype) formData.append('resourcetype', data.resourcetype);
        if (data.module) formData.append('module', data.module.toString());
        if (data.title) formData.append('title', data.title);
        if (data.order) formData.append('order', data.order.toString());

        // VideoLesson
        if (data.resourcetype === 'VideoLesson') {
            if (data.source_file instanceof File) formData.append('source_file', data.source_file);
            if (data.video_url) formData.append('video_url', data.video_url);
        }

        // PDFLesson
        if (data.resourcetype === 'PDFLesson' && data.file instanceof File) {
            formData.append('file', data.file);
        }

        // LiveLesson
        if (data.resourcetype === 'LiveLesson') {
            if (data.start_time) formData.append('start_time', data.start_time);
            if (data.end_time) formData.append('end_time', data.end_time);
            if (data.meeting_link) formData.append('meeting_link', data.meeting_link);
        }

        // Assignment
        if (data.resourcetype === 'Assignment') {
            if (data.due_date) formData.append('due_date', data.due_date);
            if (data.points) formData.append('points', data.points.toString());
            if (data.file_submission_required !== undefined) formData.append('file_submission_required', data.file_submission_required.toString());
        }

        // QuizLesson
        if (data.resourcetype === 'QuizLesson') {
            if (data.passing_score) formData.append('passing_score', data.passing_score.toString());
            if (data.duration_minutes) formData.append('duration_minutes', data.duration_minutes.toString());
            if (data.questions) formData.append('questions', JSON.stringify(data.questions));
        }

        // Common optional fields
        if (data.duration) formData.append('duration', data.duration);
        if (data.content) formData.append('content', data.content);

        const response = await api.patch(`/lessons/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
