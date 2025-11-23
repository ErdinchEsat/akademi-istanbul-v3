import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Tenant } from '@/types';

interface TenantContextType {
    currentTenant: Tenant | null;
    setTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

    const setTenant = (tenant: Tenant | null) => {
        setCurrentTenant(tenant);
    };

    return (
        <TenantContext.Provider value={{ currentTenant, setTenant }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};
