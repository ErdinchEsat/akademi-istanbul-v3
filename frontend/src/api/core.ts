import api from './axios';
import { Tenant } from '@/types';

export const coreApi = {
    getTenants: () => api.get<Tenant[]>('/tenants'),
    getTenant: (id: string) => api.get<Tenant>(`/tenants/${id}`),
};
