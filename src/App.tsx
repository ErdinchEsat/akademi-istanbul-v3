import React, { useState } from 'react';
import { User, UserRole, ViewState, Tenant } from './types';
import { MOCK_USERS } from './utils/constants';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TenantProvider, useTenant } from './contexts/TenantContext';

// Pages
import LandingPage from './features/core/pages/LandingPage';
import DashboardStudent from './features/lms/pages/DashboardStudent';
import DashboardAdmin from './features/lms/pages/DashboardAdmin';
import CoursePlayer from './features/lms/pages/CoursePlayer';
import CareerCenter from './features/career/pages/CareerCenter';
import CourseCatalog from './features/lms/pages/CourseCatalog';
import Certificates from './features/lms/pages/Certificates';
import UserManagement from './features/core/pages/UserManagement';
import ActivationPage from './features/auth/pages/ActivationPage';
import ReportsAnalytics from './features/career/pages/ReportsAnalytics';
import AcademySelection from './features/core/pages/AcademySelection';
import Settings from './features/core/pages/Settings';
import SupportFAQ from './features/core/pages/SupportFAQ';
import MyEducation from './features/lms/pages/MyEducation';
import EducationManager from './features/lms/pages/EducationManager';
import StudioBooking from './features/lms/pages/instructor/StudioBooking';
import Cart from './features/commerce/pages/Cart';
import Invoices from './features/commerce/pages/Invoices';
import Checkout from './features/commerce/pages/Checkout';
import PaymentSuccess from './features/commerce/pages/PaymentSuccess';
import PaymentFailure from './features/commerce/pages/PaymentFailure';
import GrantApplications from './features/career/pages/GrantApplications';
import StudentAnalytics from './features/career/pages/StudentAnalytics';
import SystemLogs from './features/core/pages/SystemLogs';

// Components
import AuthModal from './features/auth/components/AuthModal';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AccessibilityWidget from './components/ui/AccessibilityWidget';

const AppContent: React.FC = () => {
  const { user, login, logout } = useAuth();
  const { currentTenant, setTenant } = useTenant();

  // URL Mapping
  const VIEW_PATHS: Record<ViewState, string> = {
    [ViewState.LANDING]: '/',
    [ViewState.ACADEMY_SELECTION]: '/akademi-secimi',
    [ViewState.DASHBOARD]: '/dashboard',
    [ViewState.COURSE_PLAYER]: '/egitim/oynatici',
    [ViewState.CATALOG]: '/egitim/katalog',
    [ViewState.ADMIN_PANEL]: '/yonetim',
    [ViewState.CAREER_CENTER]: '/kariyer',
    [ViewState.CERTIFICATES]: '/sertifikalarim',
    [ViewState.USER_MANAGEMENT]: '/yonetim/kullanicilar',
    [ViewState.REPORTS]: '/yonetim/raporlar',
    [ViewState.SETTINGS]: '/ayarlar',
    [ViewState.SUPPORT]: '/destek',
    [ViewState.LOGIN]: '/giris',
    [ViewState.STUDENT_ANALYTICS]: '/yonetim/ogrenci-analiz',
    [ViewState.SYSTEM_LOGS]: '/yonetim/loglar',
    [ViewState.ACTIVATION]: '/aktivasyon',
    [ViewState.STUDIO_BOOKING]: '/studyo-rezervasyon',
    [ViewState.COMMERCE_CART]: '/sepet',
    [ViewState.COMMERCE_INVOICES]: '/faturalar',
    [ViewState.COMMERCE_CHECKOUT]: '/odeme',
    [ViewState.COMMERCE_SUCCESS]: '/odeme/basarili',
    [ViewState.COMMERCE_FAILURE]: '/odeme/hata',
    [ViewState.GRANT_APPLICATIONS]: '/kariyer/hibeler',
    [ViewState.EDUCATION_EBOOKS]: '/egitimlerim/kitaplar',
    [ViewState.EDUCATION_VIDEOS]: '/egitimlerim/videolar',
    [ViewState.EDUCATION_LIVE]: '/egitimlerim/canli',
    [ViewState.EDUCATION_ASSIGNMENTS]: '/egitimlerim/odevler',
    [ViewState.EDUCATION_QUIZZES]: '/egitimlerim/quizler',
    [ViewState.EDUCATION_EXAMS]: '/egitimlerim/sinavlar',
  };

  const getPathForView = (view: ViewState) => VIEW_PATHS[view] || '/';

  const getViewForPath = (path: string): ViewState => {
    // Exact match check first
    const entry = Object.entries(VIEW_PATHS).find(([_, p]) => p === path);
    if (entry) return entry[0] as ViewState;

    // Fallback or specific handling could go here
    return ViewState.LANDING;
  };

  // Local UI State (Routing) - Initialize from URL
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    return getViewForPath(window.location.pathname);
  });

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | number | null>(null);

  // URL Synchronization
  React.useEffect(() => {
    const handlePopState = () => {
      const view = getViewForPath(window.location.pathname);
      setCurrentView(view);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when view changes
  const updateUrl = (view: ViewState) => {
    const path = getPathForView(view);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  // Sync Auth Context with Local State (if needed) or just use Context
  // The original App.tsx had handleLogin which set currentUser and view.
  // We need to adapt that.

  const handleLogin = (role: UserRole) => {
    login(role);
    setAuthModalOpen(false);
    // On login, go to Academy Selection first (The Hub)
    setCurrentView(ViewState.ACADEMY_SELECTION);
    updateUrl(ViewState.ACADEMY_SELECTION);
  };

  const handleTenantSelection = (tenant: Tenant) => {
    setTenant(tenant);
    // Route based on role
    const targetView = (user?.role === UserRole.ADMIN || user?.role === UserRole.TENANT_ADMIN)
      ? ViewState.ADMIN_PANEL
      : ViewState.DASHBOARD;

    setCurrentView(targetView);
    updateUrl(targetView);
  };

  const handleLogout = () => {
    logout();
    setTenant(null);
    setCurrentView(ViewState.LANDING);
    updateUrl(ViewState.LANDING);
  };

  const navigateTo = (view: ViewState, courseId?: string) => {
    if (courseId) setActiveCourseId(courseId);
    // If user clicks "Platforma Dön" or similar, clear tenant context potentially
    if (view === ViewState.ACADEMY_SELECTION) {
      setTenant(null);
    }
    setCurrentView(view);
    updateUrl(view);
  };

  const handleStudentSelect = (studentId: string | number) => {
    setSelectedStudentId(studentId);
    setCurrentView(ViewState.STUDENT_ANALYTICS);
    updateUrl(ViewState.STUDENT_ANALYTICS);
  };

  // Helper to determine if we should show the manager or the student view
  const renderEducationView = (category: 'ebooks' | 'videos' | 'live' | 'assignments' | 'quizzes' | 'exams') => {
    if (user?.role === UserRole.INSTRUCTOR) {
      return <EducationManager category={category} />;
    }
    return <MyEducation category={category} onCourseClick={(id) => navigateTo(ViewState.COURSE_PLAYER, id)} />;
  };

  // Rendering Logic
  const renderContent = () => {
    switch (currentView) {
      case ViewState.LANDING:
        return <LandingPage onLoginClick={() => setAuthModalOpen(true)} onActivationClick={() => { setCurrentView(ViewState.ACTIVATION); updateUrl(ViewState.ACTIVATION); }} />;
      case ViewState.ACADEMY_SELECTION:
        return user ? (
          <AcademySelection
            user={user}
            onSelectTenant={handleTenantSelection}
            onSelectCareerCenter={() => navigateTo(ViewState.CAREER_CENTER)}
          />
        ) : <LandingPage onLoginClick={() => setAuthModalOpen(true)} onActivationClick={() => { setCurrentView(ViewState.ACTIVATION); updateUrl(ViewState.ACTIVATION); }} />;
      case ViewState.DASHBOARD:
        if (user?.role === UserRole.ADMIN || user?.role === UserRole.TENANT_ADMIN) return <DashboardAdmin />;
        if (user?.role === UserRole.INSTRUCTOR) return <DashboardAdmin isInstructor />;
        return <DashboardStudent onCourseClick={(id) => navigateTo(ViewState.COURSE_PLAYER, id)} userTenantId={user?.tenantId} />;
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
        return <Settings user={user} />;
      case ViewState.SUPPORT:
        return <SupportFAQ />;
      case ViewState.STUDENT_ANALYTICS:
        return <StudentAnalytics studentId={selectedStudentId} onBack={() => navigateTo(ViewState.USER_MANAGEMENT)} />;
      case ViewState.SYSTEM_LOGS:
        return <SystemLogs userRole={user?.role} userTenantId={user?.tenantId} />;
      case ViewState.ACTIVATION:
        return <ActivationPage />;
      case ViewState.STUDIO_BOOKING:
        return <StudioBooking />;
      case ViewState.COMMERCE_CART:
        return <Cart />;
      case ViewState.COMMERCE_INVOICES:
        return <Invoices />;
      case ViewState.COMMERCE_CHECKOUT:
        return <Checkout onSuccess={() => navigateTo(ViewState.COMMERCE_SUCCESS)} onFailure={() => navigateTo(ViewState.COMMERCE_FAILURE)} />;
      case ViewState.COMMERCE_SUCCESS:
        return <PaymentSuccess onContinue={() => navigateTo(ViewState.DASHBOARD)} />;
      case ViewState.COMMERCE_FAILURE:
        return <PaymentFailure onRetry={() => navigateTo(ViewState.COMMERCE_CHECKOUT)} onCancel={() => navigateTo(ViewState.COMMERCE_CART)} />;
      case ViewState.GRANT_APPLICATIONS:
        return <GrantApplications />;

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
        return <LandingPage onLoginClick={() => setAuthModalOpen(true)} onActivationClick={() => { setCurrentView(ViewState.ACTIVATION); updateUrl(ViewState.ACTIVATION); }} />;
    }
  };

  // Hide sidebar on Landing Page and Academy Selection Hub
  const showSidebar = user && currentView !== ViewState.LANDING && currentView !== ViewState.ACADEMY_SELECTION;

  return (
    <div className="flex h-screen bg-gray-50 text-slate-800 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Show Sidebar only if logged in and inside a tenant context or generic tool */}
      {showSidebar && (
        <Sidebar
          user={user}
          currentView={currentView}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header shows on all authenticated pages including Academy Selection */}
        {/* Header shows on all authenticated pages EXCEPT Landing and Activation */}
        {user && currentView !== ViewState.LANDING && currentView !== ViewState.ACTIVATION && (
          <Header user={user} currentTenant={currentTenant} />
        )}

        <main className="flex-1 overflow-y-auto scroll-smooth relative">
          {renderContent()}
        </main>



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
};

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <AppContent />
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;
