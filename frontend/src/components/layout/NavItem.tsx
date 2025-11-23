import React from 'react';
import clsx from 'clsx';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 text-sm font-medium group relative overflow-hidden",
            active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
        )}
    >
        {/* Active Glow Effect */}
        {active && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>}

        <span className={clsx("transition-colors relative z-10", active ? "text-white" : "text-slate-500 group-hover:text-white")}>
            {icon}
        </span>
        <span className="flex-1 text-left relative z-10">{label}</span>
        {badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm relative z-10 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                {badge}
            </span>
        )}
    </button>
);

export default NavItem;
