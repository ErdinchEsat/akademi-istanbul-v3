import React from 'react';
import { MOCK_COURSES, MOCK_LEADERBOARD, MOCK_USERS, MOCK_TENANTS } from '../services/mockData';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import ActivityChart from '../components/dashboard/ActivityChart';
import LeaderboardWidget from '../components/dashboard/LeaderboardWidget';
import CourseList from '../components/dashboard/CourseList';

interface DashboardStudentProps {
    onCourseClick: (courseId: string) => void;
    userTenantId?: string;
}

const DashboardStudent: React.FC<DashboardStudentProps> = ({ onCourseClick, userTenantId }) => {
    const user = MOCK_USERS.student;
    const currentTenant = MOCK_TENANTS.find(t => t.id === userTenantId);

    const myCourses = MOCK_COURSES.filter(c => c.tenantId === userTenantId);
    const otherCourses = MOCK_COURSES.filter(c => c.tenantId !== userTenantId);
    const displayedCourses = userTenantId ? [...myCourses, ...otherCourses] : MOCK_COURSES;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
            <WelcomeHero
                user={user}
                currentTenant={currentTenant}
                myCoursesCount={myCourses.length}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ActivityChart currentTenant={currentTenant} />
                <LeaderboardWidget leaderboard={MOCK_LEADERBOARD} currentUser={user} />
            </div>

            <CourseList
                courses={displayedCourses}
                currentTenant={currentTenant}
                userTenantId={userTenantId}
                onCourseClick={onCourseClick}
            />
        </div>
    );
};

export default DashboardStudent;
