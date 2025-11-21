
import React, { useState } from 'react';
import { User, UserRole, ViewState, Tenant } from './types';
import { MOCK_USERS } from './constants';
import LandingPage from './components/LandingPage';
import DashboardStudent from './components/DashboardStudent';
import DashboardAdmin from './components/DashboardAdmin';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import CoursePlayer from './components/CoursePlayer';
import Header from './components/Header';
import CareerCenter from './components/CareerCenter';
import AIChatAssistant from './components/AIChatAssistant';
import AccessibilityWidget from './components/AccessibilityWidget';
import CourseCatalog from './components/CourseCatalog';
import Certificates from './components/Certificates';
import UserManagement from './components/UserManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import AcademySelection from './components/AcademySelection';
import Settings from './components/Settings';
import SupportFAQ from './components/SupportFAQ';
import MyEducation from './components/MyEducation';
import EducationManager from './components/EducationManager';
import StudentAnalytics from './components/StudentAnalytics';
import SystemLogs from './components/SystemLogs';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | number | null>(null);
  // Store the selected tenant for theming/context
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  const handleLogin = (role: UserRole) => {
    let baseUser: User = MOCK_USERS.student; // Default
    
    if (role === UserRole.ADMIN) baseUser = MOCK_USERS.admin;
    else if (role === UserRole.INSTRUCTOR) baseUser = MOCK_USERS.instructor;
    else if (role === UserRole.TENANT_ADMIN) baseUser = MOCK_USERS.admin; // Simulate tenant admin
    
    const newUser: User = {
      ...baseUser,
      role: role,
    };

    setCurrentUser(newUser);
    // On login, go to Academy Selection first (The Hub)
    setCurrentView(ViewState.ACADEMY_SELECTION);
    setAuthModalOpen(false);
  };

  const handleTenantSelection = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    // Update user's context tenant
    if(currentUser) {
      // If user is GLOBAL ADMIN, they keep their global role but enter a tenant context
      // If user is TENANT ADMIN, they are bound to this tenant
      const updatedUser = { 
        ...currentUser, 
        tenantId: tenant.id, 
        name: `${currentUser.name.split(' ')[0]} (${tenant.name})` 
      };
      setCurrentUser(updatedUser);
    }

    // Route based on role
    const targetView = (currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.TENANT_ADMIN) 
      ? ViewState.ADMIN_PANEL 
      : ViewState.DASHBOARD;

    setCurrentView(targetView);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTenant(null);
    setCurrentView(ViewState.LANDING);
  };

  const navigateTo = (view: ViewState, courseId?: string) => {
    if (courseId) setActiveCourseId(courseId);
    // If user clicks "Platforma Dön" or similar, clear tenant context potentially, or just view
    if (view === ViewState.ACADEMY_SELECTION) {
        setCurrentTenant(null);
    }
    setCurrentView(view);
  };

  const handleStudentSelect = (studentId: string | number) => {
    setSelectedStudentId(studentId);
    setCurrentView(ViewState.STUDENT_ANALYTICS);
  };

  // Helper to determine if we should show the manager or the student view
  const renderEducationView = (category: 'ebooks' | 'videos' | 'live' | 'assignments' | 'quizzes' | 'exams') => {
    if (currentUser?.role === UserRole.INSTRUCTOR) {
      return <EducationManager category={category} />;
    }
    return <MyEducation category={category} onCourseClick={(id) => navigateTo(ViewState.COURSE_PLAYER, id)} />;
  };

  // Rendering Logic
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
        return <UserManagement onStudentSelect={handleStudentSelect} />;
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
      
      // My Education Sub-Views (Dynamic based on Role)
      case ViewState.EDUCATION_EBOOKS:
        return renderEducationView('ebooks');
      case ViewState.EDUCATION_VIDEOS:
        return renderEducationView('videos');
      case ViewState.EDUCATION_LIVE:
        return renderEducationView('live');
      case ViewState.EDUCATION_ASSIGNMENTS:
        return renderEducationView('assignments');
      case ViewState.EDUCATION_QUIZZES:
        return renderEducationView('quizzes');
      case ViewState.EDUCATION_EXAMS:
        return renderEducationView('exams');
        
      default:
        return <LandingPage onLoginClick={() => setAuthModalOpen(true)} />;
    }
  };

  // Hide sidebar on Landing Page and Academy Selection Hub
  const showSidebar = currentUser && currentView !== ViewState.LANDING && currentView !== ViewState.ACADEMY_SELECTION;

  return (
    <div className="flex h-screen bg-gray-50 text-slate-800 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Show Sidebar only if logged in and inside a tenant context or generic tool */}
      {showSidebar && (
        <Sidebar 
          user={currentUser} 
          currentView={currentView} 
          onNavigate={navigateTo} 
          onLogout={handleLogout}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header shows on all authenticated pages including Academy Selection */}
        {currentUser && (
           <Header user={currentUser} currentTenant={currentTenant} />
        )}
        
        <main className="flex-1 overflow-y-auto scroll-smooth relative">
          {renderContent()}
        </main>
        
        {/* Global AI Assistant (Only for logged in users, not in player) */}
        {currentUser && currentView !== ViewState.COURSE_PLAYER && (
           <AIChatAssistant />
        )}
        
        {/* Accessibility Widget (Global) */}
        <AccessibilityWidget />
      </div>

      {/* Auth Modal */}
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
