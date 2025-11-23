
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <RouterProvider router={router} />
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;
