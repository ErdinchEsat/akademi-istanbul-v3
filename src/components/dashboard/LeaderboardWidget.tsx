import React from 'react';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import clsx from 'clsx';
import { LeaderboardUser } from '../../types/domain';
import { User } from '../../types/auth';

interface LeaderboardWidgetProps {
    leaderboard: LeaderboardUser[];
    currentUser: User;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ leaderboard, currentUser }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" /> Sıralama
                </h3>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Tümünü Gör</button>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {leaderboard.map((u, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${u.name.includes(currentUser.name.split(' ')[0]) ? 'bg-indigo-50 border border-indigo-100 ring-1 ring-indigo-200' : 'hover:bg-gray-50 border border-transparent'}`}>
                        <div className={clsx(
                            "w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full shadow-sm",
                            idx === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white" :
                                idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white" :
                                    idx === 2 ? "bg-gradient-to-br from-orange-300 to-orange-400 text-white" :
                                        "bg-slate-100 text-slate-500"
                        )}>
                            {u.rank}
                        </div>
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{u.points} Puan</p>
                        </div>
                        <div>
                            {u.trend === 'up' ? <ArrowUp className="w-4 h-4 text-green-500" /> : u.trend === 'down' ? <ArrowDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-gray-300" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardWidget;
