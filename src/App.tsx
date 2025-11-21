import React from 'react';
import { UserRole } from './types/auth';
import { ViewState } from './types/ui';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';

// Components (Legacy paths - should be moved to src/components eventually)
import LandingPage from '../components/LandingPage';
import DashboardAdmin from '../components/DashboardAdmin';
import AuthModal from '../components/AuthModal';
import CoursePlayer from '../components/CoursePlayer';
import Header from '../components/Header';
import CareerCenter from '../components/CareerCenter';
import AIChatAssistant from '../components/AIChatAssistant';
import AccessibilityWidget from '../components/AccessibilityWidget';
import CourseCatalog from '../components/CourseCatalog';
import Certificates from '../components/Certificates';
import UserManagement from '../components/UserManagement';
import ReportsAnalytics from '../components/ReportsAnalytics';
import AcademySelection from '../components/AcademySelection';
import Settings from '../components/Settings';
import SupportFAQ from '../components/SupportFAQ';
import MyEducation from '../components/MyEducation';
import EducationManager from '../components/EducationManager';
import StudentAnalytics from '../components/StudentAnalytics';
import SystemLogs from '../components/SystemLogs';

// Refactored Components
import Sidebar from './components/layout/Sidebar';
import DashboardStudent from './pages/DashboardStudent';

function App() {
    const {
        currentUser,
        currentTenant,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        logout,
        selectTenant
    } = useAuth();

    const {
        currentView,
        activeCourseId,
        selectedStudentId,
        navigateTo,
        selectStudent,
        setCurrentView
    } = useNavigation();

    const handleLogin = (role: UserRole) => {
        login(role);
        setCurrentView(ViewState.ACADEMY_SELECTION);
    };

    const handleTenantSelection = (tenant: any) => {
        selectTenant(tenant);
        const targetView = (currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.TENANT_ADMIN)
            ? ViewState.ADMIN_PANEL
            : ViewState.DASHBOARD;
        setCurrentView(targetView);
    };

    const handleLogout = () => {
        logout();
        setCurrentView(ViewState.LANDING);
    };

    const renderEducationView = (category: 'ebooks' | 'videos' | 'live' | 'assignments' | 'quizzes' | 'exams') => {
        if (currentUser?.role === UserRole.INSTRUCTOR) {
            return <EducationManager category={category} />;
        }
        return <MyEducation category={category} onCourseClick={(id) => navigateTo(ViewState.COURSE_PLAYER, id)} />;
    };

    const renderContent = () => {
        switch (currentView) {
            case ViewState.LANDING:
                return <LandingPage onLoginClick={() => setAuthModalOpen(true)} />;
            case ViewState.ACADEMY_SELECTION:
                return currentUser ? (
                    <AcademySelection
                        user={currentUser}
                        onSelectTenant={handleTenantSelection}
                        onSelectCareerCenter={() => navigateTo(ViewState.CAREER_CENTER)}
                    />
                ) : <LandingPage onLoginClick={() => setAuthModalOpen(true)} />;
            case ViewState.DASHBOARD:
                if (currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.TENANT_ADMIN) return <DashboardAdmin />;
                if (currentUser?.role === UserRole.INSTRUCTOR) return <DashboardAdmin isInstructor />;
                return <DashboardStudent onCourseClick={(id) => navigateTo(ViewState.COURSE_PLAYER, id)} userTenantId={currentUser?.tenantId} />;
            case ViewState.COURSE_PLAYER:
                return <CoursePlayer courseId={activeCourseId} onBack={() => navigateTo(ViewState.DASHBOARD)} />;
            case ViewState.CATALOG:
                return <CourseCatalog onCourseClick={(id) => navigateTo(ViewState.COURSE_PLAYER, id)} />;
            case ViewState.ADMIN_PANEL:
                return <DashboardAdmin />;
            case ViewState.CAREER_CENTER:
                return <CareerCenter />;
            case ViewState.CERTIFICATES:
                return <Certificates />;
            case ViewState.USER_MANAGEMENT:
                return <UserManagement onStudentSelect={selectStudent} />;
            case ViewState.REPORTS:
                return <ReportsAnalytics />;
            case ViewState.SETTINGS:
                return <Settings user={currentUser} />;
            case ViewState.SUPPORT:
                return <SupportFAQ />;
            case ViewState.STUDENT_ANALYTICS:
                return <StudentAnalytics studentId={selectedStudentId} onBack={() => navigateTo(ViewState.USER_MANAGEMENT)} />;
            case ViewState.SYSTEM_LOGS:
                return <SystemLogs userRole={currentUser?.role} userTenantId={currentUser?.tenantId} />;

            case ViewState.EDUCATION_EBOOKS: return renderEducationView('ebooks');
            case ViewState.EDUCATION_VIDEOS: return renderEducationView('videos');
            case ViewState.EDUCATION_LIVE: return renderEducationView('live');
            case ViewState.EDUCATION_ASSIGNMENTS: return renderEducationView('assignments');
            case ViewState.EDUCATION_QUIZZES: return renderEducationView('quizzes');
            case ViewState.EDUCATION_EXAMS: return renderEducationView('exams');

            default:
                return <LandingPage onLoginClick={() => setAuthModalOpen(true)} />;
        }
    };

    const showSidebar = currentUser && currentView !== ViewState.LANDING && currentView !== ViewState.ACADEMY_SELECTION;

    return (
        <div className="flex h-screen bg-gray-50 text-slate-800 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {showSidebar && (
                <Sidebar
                    user={currentUser}
                    currentView={currentView}
                    onNavigate={navigateTo}
                    onLogout={handleLogout}
                />
            )}

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {currentUser && (
                    <Header user={currentUser} currentTenant={currentTenant} />
                )}

                <main className="flex-1 overflow-y-auto scroll-smooth relative">
                    {renderContent()}
                </main>

                {currentUser && currentView !== ViewState.COURSE_PLAYER && (
                    <AIChatAssistant />
                )}

                <AccessibilityWidget />
            </div>

            {isAuthModalOpen && (
                <AuthModal
                    onClose={() => setAuthModalOpen(false)}
                    onLogin={handleLogin}
                />
            )}
        </div>
    );
}

export default App;
