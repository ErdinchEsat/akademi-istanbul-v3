
import React from 'react';
import { createBrowserRouter, Navigate, useParams, useNavigate, Outlet, useSearchParams, useOutletContext } from 'react-router-dom';
import { UserRole } from './types';
import { useAuth } from './contexts/AuthContext';
import { useTenant } from './contexts/TenantContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Components
import AuthModal from './features/auth/components/AuthModal';

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

// Root Layout with AuthModal
const RootLayout = () => {
    const [isAuthModalOpen, setAuthModalOpen] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (searchParams.get('login') === 'true') {
            setAuthModalOpen(true);
        }
    }, [searchParams]);

    const handleLogin = (role: UserRole) => {
        login(role);
        setAuthModalOpen(false);
        setSearchParams({});
        navigate('/akademi-secimi');
    };

    return (
        <>
            <Outlet context={{ setAuthModalOpen }} />
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setAuthModalOpen(false);
                    setSearchParams({});
                }}
                onLogin={handleLogin}
            />
        </>
    );
};

// Wrappers
const DashboardHome = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" />;

    if (user.role === UserRole.ADMIN || user.role === UserRole.TENANT_ADMIN) return <DashboardAdmin />;
    if (user.role === UserRole.INSTRUCTOR) return <DashboardAdmin isInstructor />;

    const navigate = useNavigate();
    return <DashboardStudent onCourseClick={(id) => navigate(`/egitim/oynatici/${id}`)} userTenantId={user.tenantId} />;
};

const CoursePlayerWrapper = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    return <CoursePlayer courseId={courseId || null} onBack={() => navigate(-1)} />;
};

const StudentAnalyticsWrapper = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    return <StudentAnalytics studentId={studentId || null} onBack={() => navigate('/yonetim/kullanicilar')} />;
};

const UserManagementWrapper = () => {
    const navigate = useNavigate();
    return <UserManagement onStudentSelect={(id) => navigate(`/yonetim/ogrenci-analiz/${id}`)} />;
};

const SystemLogsWrapper = () => {
    const { user } = useAuth();
    return <SystemLogs userRole={user?.role} userTenantId={user?.tenantId} />;
};

const SettingsWrapper = () => {
    const { user } = useAuth();
    return <Settings user={user!} />;
};

const EducationWrapper = () => {
    const { category } = useParams<{ category: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const validCategory = category as 'ebooks' | 'videos' | 'live' | 'assignments' | 'quizzes' | 'exams';

    if (user?.role === UserRole.INSTRUCTOR) {
        return <EducationManager category={validCategory} />;
    }
    return <MyEducation category={validCategory} onCourseClick={(id) => navigate(`/egitim/oynatici/${id}`)} />;
};

const CourseCatalogWrapper = () => {
    const navigate = useNavigate();
    return <CourseCatalog onCourseClick={(id) => navigate(`/egitim/oynatici/${id}`)} />;
};

const CheckoutWrapper = () => {
    const navigate = useNavigate();
    return <Checkout onSuccess={() => navigate('/odeme/basarili')} onFailure={() => navigate('/odeme/hata')} />;
};

const PaymentSuccessWrapper = () => {
    const navigate = useNavigate();
    return <PaymentSuccess onContinue={() => navigate('/dashboard')} />;
};

const PaymentFailureWrapper = () => {
    const navigate = useNavigate();
    return <PaymentFailure onRetry={() => navigate('/odeme')} onCancel={() => navigate('/sepet')} />;
};

const AcademySelectionRoute = () => {
    const { user } = useAuth();
    const { setTenant } = useTenant();
    const navigate = useNavigate();

    const handleTenantSelection = (tenant: any) => {
        setTenant(tenant);
        const targetPath = (user?.role === UserRole.ADMIN || user?.role === UserRole.TENANT_ADMIN)
            ? '/yonetim'
            : '/dashboard';
        navigate(targetPath);
    };

    if (!user) return <Navigate to="/" />;

    return (
        <AcademySelection
            user={user}
            onSelectTenant={handleTenantSelection}
            onSelectCareerCenter={() => navigate('/kariyer')}
        />
    );
};

const LandingPageWrapper = () => {
    const { setAuthModalOpen } = useOutletContext<{ setAuthModalOpen: (open: boolean) => void }>();
    const navigate = useNavigate();

    return <LandingPage
        onLoginClick={() => setAuthModalOpen(true)}
        onActivationClick={() => navigate('/aktivasyon')}
    />;
};


export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <LandingPageWrapper />,
            },
            {
                path: '/aktivasyon',
                element: <ActivationPage />,
            },
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: '/akademi-secimi',
                        element: <AcademySelectionRoute />
                    }
                ]
            },
            {
                element: <DashboardLayout />,
                children: [
                    { path: 'dashboard', element: <DashboardHome /> },
                    { path: 'yonetim', element: <DashboardAdmin /> },
                    { path: 'egitim/katalog', element: <CourseCatalogWrapper /> },
                    { path: 'egitim/oynatici/:courseId', element: <CoursePlayerWrapper /> },
                    { path: 'kariyer', element: <CareerCenter /> },
                    { path: 'kariyer/hibeler', element: <GrantApplications /> },
                    { path: 'kariyer/is-ilanlari', element: <CareerCenter /> },
                    { path: 'kariyer/cv-portfolyo', element: <CareerCenter /> },
                    { path: 'sertifikalarim', element: <Certificates /> },
                    { path: 'yonetim/kullanicilar', element: <UserManagementWrapper /> },
                    { path: 'yonetim/raporlar', element: <ReportsAnalytics /> },
                    { path: 'yonetim/ogrenci-analiz/:studentId?', element: <StudentAnalyticsWrapper /> },
                    { path: 'yonetim/loglar', element: <SystemLogsWrapper /> },
                    { path: 'ayarlar', element: <SettingsWrapper /> },
                    { path: 'destek', element: <SupportFAQ /> },
                    { path: 'studyo-rezervasyon', element: <StudioBooking /> },
                    { path: 'sepet', element: <Cart /> },
                    { path: 'faturalar', element: <Invoices /> },
                    { path: 'odeme', element: <CheckoutWrapper /> },
                    { path: 'odeme/basarili', element: <PaymentSuccessWrapper /> },
                    { path: 'odeme/hata', element: <PaymentFailureWrapper /> },
                    { path: 'egitimlerim/:category', element: <EducationWrapper /> },
                ]
            }
        ]
    }
]);
