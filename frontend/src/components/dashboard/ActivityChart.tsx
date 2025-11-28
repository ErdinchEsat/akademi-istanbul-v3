import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Tenant } from '../../types/auth';

interface ActivityChartProps {
    currentTenant?: Tenant;
}

const data = [
    { name: 'Pzt', saat: 2 },
    { name: 'Sal', saat: 1.5 },
    { name: 'Çar', saat: 3 },
    { name: 'Per', saat: 1 },
    { name: 'Cum', saat: 4 },
    { name: 'Cmt', saat: 2 },
    { name: 'Paz', saat: 0.5 },
];

const ActivityChart: React.FC<ActivityChartProps> = React.memo(({ currentTenant }) => {
    // Memoize bar color calculation to prevent unnecessary recalculation
    const barStyle = useMemo(() => {
        const color = currentTenant?.color;
        if (color === 'emerald') return { fill: '#10b981' };
        if (color === 'blue') return { fill: '#3b82f6' };
        return { fill: '#6366f1' };
    }, [currentTenant?.color]);

    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" /> Haftalık Aktivite
                    </h3>
                    <p className="text-sm text-gray-500">Ders izleme ve test çözme süreleri</p>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-extrabold text-slate-900">14.5s</span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+2.5s Artış</span>
                </div>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" dy={10} />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [`${value} Saat`, 'Süre']}
                        />
                        <Bar
                            dataKey="saat"
                            fill={currentTenant ? `var(--color-${currentTenant.color}-500)` : '#6366f1'}
                            radius={[6, 6, 6, 6]}
                            barSize={40}
                            style={barStyle}
                        />
                    </ReBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

ActivityChart.displayName = 'ActivityChart';

export default ActivityChart;
