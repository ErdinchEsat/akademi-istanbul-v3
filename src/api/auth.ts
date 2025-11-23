import api from './axios';
import { User } from '@/types';

export const authApi = {
    login: (credentials: any) => api.post<{ user: User; token: string }>('/auth/login', credentials),
    register: (data: any) => api.post<{ user: User; token: string }>('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get<User>('/auth/me'),
    validateActivationCode: (code: string) => {
        // Mock implementation
        return new Promise<{ valid: boolean; tenantId?: string; message?: string }>((resolve) => {
            setTimeout(() => {
                if (code === 'IBB2024') {
                    resolve({ valid: true, tenantId: 'ibb', message: 'Kod doğrulandı: İBB Akademi' });
                } else if (code === 'TECH101') {
                    resolve({ valid: true, tenantId: 'tech', message: 'Kod doğrulandı: Yazılım Akademisi' });
                } else {
                    resolve({ valid: false, message: 'Geçersiz aktivasyon kodu.' });
                }
            }, 1000);
        });
    }
};
