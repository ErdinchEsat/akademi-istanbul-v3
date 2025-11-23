import api from './axios';

export const careerApi = {
    getJobs: () => api.get('/jobs'),
    getStudentAnalytics: (studentId: string | number) => api.get(`/career/analytics/${studentId}`),

    // Grants & Opportunities
    getGrants: () => {
        return new Promise<{ id: string; title: string; organization: string; deadline: string; amount: string }[]>((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '1', title: 'Genç Girişimci Hibe Programı', organization: 'KOSGEB', deadline: '2024-03-01', amount: '150.000 TL' },
                    { id: '2', title: 'Teknoloji Odaklı Sanayi Hamlesi', organization: 'Sanayi Bakanlığı', deadline: '2024-04-15', amount: '500.000 TL' },
                    { id: '3', title: 'Yaratıcı Endüstriler Fonu', organization: 'İSTKA', deadline: '2024-02-28', amount: '250.000 TL' },
                ]);
            }, 600);
        });
    },
    applyForGrant: (grantId: string) => {
        return new Promise<{ success: boolean; message: string }>((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Başvurunuz başarıyla alındı.' });
            }, 1000);
        });
    },
    apply: (jobId: string) => api.post(`/jobs/${jobId}/apply`),
};
