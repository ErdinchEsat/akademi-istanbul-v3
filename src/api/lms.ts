import api from './axios';
import { Course } from '@/types';

export const lmsApi = {
    getEnrolledCourses: () => api.get<Course[]>('/lms/courses/enrolled'),
    getCourseDetails: (id: string) => api.get<Course>(`/lms/courses/${id}`),
    enroll: (courseId: string) => api.post(`/courses/${courseId}/enroll`),

    // Studio Booking
    getStudioSlots: (date: string) => {
        // Mock implementation
        return new Promise<{ id: string; time: string; available: boolean }[]>((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '1', time: '09:00', available: true },
                    { id: '2', time: '10:00', available: false },
                    { id: '3', time: '11:00', available: true },
                    { id: '4', time: '13:00', available: true },
                    { id: '5', time: '14:00', available: true },
                    { id: '6', time: '15:00', available: false },
                ]);
            }, 800);
        });
    },
    bookStudio: (slotId: string, date: string) => {
        return new Promise<{ success: boolean; message: string }>((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Rezervasyonunuz başarıyla oluşturuldu.' });
            }, 1000);
        });
    }
};
