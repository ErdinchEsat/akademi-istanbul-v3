import React from 'react';
import { Bell } from 'lucide-react';
import { User, Tenant } from '../types';

interface HeaderProps {
  user: User;
  currentTenant?: Tenant | null;
}

const Header: React.FC<HeaderProps> = ({ user, currentTenant }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex items-center gap-4">
        {/* Search bar removed as requested */}
      </div>

      <div className="flex items-center gap-4">
        {/* Dynamic Tenant Badge */}
        {currentTenant && (
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-${currentTenant.color}-50 border border-${currentTenant.color}-100`}>
             <img src={currentTenant.logo} alt={currentTenant.name} className="w-5 h-5 rounded-full object-cover" />
             <span className={`text-xs font-bold text-${currentTenant.color}-700`}>
               {currentTenant.name}
             </span>
          </div>
        )}

        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-9 h-9 rounded-full border border-gray-200 object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;