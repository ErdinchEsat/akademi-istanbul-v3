import React from 'react';
import { PlayCircle } from 'lucide-react';
import clsx from 'clsx';
import { Course } from '../../types/course';

interface CourseCardProps {
    course: Course;
    userTenantId?: string;
    onClick: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, userTenantId, onClick }) => {
    return (
        <div
            onClick={() => onClick(course.id)}
            className={clsx(
                "bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full relative transform hover:-translate-y-1",
                course.tenantId === userTenantId ? 'border-indigo-200 shadow-indigo-100' : 'border-gray-100 shadow-sm'
            )}
        >
            <div className="relative h-44 overflow-hidden">
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {course.isLive && (
                        <div className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse shadow-lg flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span> CANLI
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                    <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/20 uppercase tracking-wide">
                        {course.category}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="mb-1">
                    {/* Tenant Badge logic */}
                    {course.tenantId !== userTenantId && (
                        <span className={clsx(
                            "text-[10px] font-bold uppercase tracking-wider mb-2 inline-block",
                            course.tenantId === 'ibb' ? "text-blue-600" : "text-emerald-600"
                        )}>
                            {course.tenantId === 'ibb' ? 'Enstitü İstanbul' : 'Ümraniye Akademi'}
                        </span>
                    )}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                    {course.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span> {course.instructor}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col gap-1 w-full mr-4">
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                            <span>İlerleme</span>
                            <span>%{course.progress}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                        </div>
                    </div>

                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <PlayCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
