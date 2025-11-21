export enum UserRole {
  GUEST = 'GUEST',
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  tenantId?: string;
  email?: string;
  title?: string;
  points?: number;
}

export interface Tenant {
  id: string;
  name: string;
  logo: string;
  color: string;
  type: 'Municipality' | 'Corporate' | 'University';
}
