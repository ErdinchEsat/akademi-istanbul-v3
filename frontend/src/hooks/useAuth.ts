import { useState } from 'react';
import { User, UserRole, Tenant } from '../types/auth';
import { MOCK_USERS } from '../services/mockData';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const login = (role: UserRole) => {
        let baseUser: User = MOCK_USERS.student; // Default

        if (role === UserRole.ADMIN) baseUser = MOCK_USERS.admin;
        else if (role === UserRole.INSTRUCTOR) baseUser = MOCK_USERS.instructor;
        else if (role === UserRole.TENANT_ADMIN) baseUser = MOCK_USERS.admin;

        const newUser: User = {
            ...baseUser,
            role: role,
        };

        setCurrentUser(newUser);
        setAuthModalOpen(false);
        return newUser;
    };

    const logout = () => {
        setCurrentUser(null);
        setCurrentTenant(null);
    };

    const selectTenant = (tenant: Tenant) => {
        setCurrentTenant(tenant);
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                tenantId: tenant.id,
                name: `${currentUser.name.split(' ')[0]} (${tenant.name})`
            };
            setCurrentUser(updatedUser);
        }
    };

    return {
        currentUser,
        currentTenant,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        logout,
        selectTenant
    };
};
