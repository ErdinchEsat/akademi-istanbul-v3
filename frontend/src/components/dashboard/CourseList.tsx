import React from 'react';
import { Award } from 'lucide-react';
import CourseCard from './CourseCard';
import { Course } from '../../types/course';
import { Tenant } from '../../types/auth';

interface CourseListProps {
    courses: Course[];
    currentTenant?: Tenant;
    userTenantId?: string;
    onCourseClick: (id: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, currentTenant, userTenantId, onCourseClick }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Kurs Kataloğu</h2>
                    <p className="text-slate-500 mt-1">Gelişiminize katkı sağlayacak eğitimler.</p>
                </div>
                {userTenantId && (
                    <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg">
                        <Award className="w-4 h-4" />
                        {currentTenant?.name} Tarafından Önerilenler
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map(course => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        userTenantId={userTenantId}
                        onClick={onCourseClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseList;
