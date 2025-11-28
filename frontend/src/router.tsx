import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, useParams, useNavigate, Outlet, useSearchParams, useOutletContext } from 'react-router-dom';
import { UserRole } from './types';
import { useAuth } from './contexts/AuthContext';
import { useTenant } from './contexts/TenantContext';

// Layouts (keep eager - needed for layout structure)
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Components (keep eager - used globally)
import AuthModal from './features/auth/components/AuthModal';
import RegisterModal from './features/auth/components/RegisterModal';

// Loading Fallback Component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
);

// Lazy-loaded Pages (Code Splitting for Performance)
const LandingPage = React.lazy(() => import('./features/core/pages/LandingPage'));
const DashboardStudent = React.lazy(() => import('./features/lms/pages/DashboardStudent'));
const DashboardAdmin = React.lazy(() => import('./features/lms/pages/DashboardAdmin'));
const CoursePlayer = React.lazy(() => import('./features/lms/pages/CoursePlayer'));
const CareerCenter = React.lazy(() => import('./features/career/pages/CareerCenter'));
const CourseCatalog = React.lazy(() => import('./features/lms/pages/CourseCatalog'));
const CourseCreate = React.lazy(() => import('./features/lms/pages/CourseCreate'));
const Certificates = React.lazy(() => import('./features/lms/pages/Certificates'));
const UserManagement = React.lazy(() => import('./features/core/pages/UserManagement'));
const ReportsAnalytics = React.lazy(() => import('./features/career/pages/ReportsAnalytics'));
const AcademySelection = React.lazy(() => import('./features/core/pages/AcademySelection'));
const Settings = React.lazy(() => import('./features/core/pages/Settings'));
const SupportFAQ = React.lazy(() => import('./features/core/pages/SupportFAQ'));
const MyEducation = React.lazy(() => import('./features/lms/pages/MyEducation'));
const EducationManager = React.lazy(() => import('./features/lms/pages/EducationManager'));
const StudioBooking = React.lazy(() => import('./features/lms/pages/instructor/StudioBooking'));
const LiveClassManager = React.lazy(() => import('./features/lms/pages/instructor/LiveClassManager'));
const AssignmentManager = React.lazy(() => import('./features/lms/pages/instructor/AssignmentManager'));
const QuizManager = React.lazy(() => import('./features/lms/pages/instructor/QuizManager'));
const ExamManager = React.lazy(() => import('./features/lms/pages/instructor/ExamManager'));
const Cart = React.lazy(() => import('./features/commerce/pages/Cart'));
const Invoices = React.lazy(() => import('./features/commerce/pages/Invoices'));
const Checkout = React.lazy(() => import('./features/commerce/pages/Checkout'));
const PaymentSuccess = React.lazy(() => import('./features/commerce/pages/PaymentSuccess'));
const PaymentFailure = React.lazy(() => import('./features/commerce/pages/PaymentFailure'));
const GrantApplications = React.lazy(() => import('./features/career/pages/GrantApplications'));
const StudentAnalytics = React.lazy(() => import('./features/career/pages/StudentAnalytics'));
const SystemLogs = React.lazy(() => import('./features/core/pages/SystemLogs'));


// Root Layout with AuthModal and RegisterModal
const RootLayout = () => {
    const [isAuthModalOpen, setAuthModalOpen] = React.useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (searchParams.get('login') === 'true') {
            setAuthModalOpen(true);
        }
    }, [searchParams]);

    const handleLogin = async (role: UserRole) => {
        await login(role);
        setAuthModalOpen(false);
        setSearchParams({});
        navigate('/akademi-secimi');
    };

    return (
        <>
            <Outlet context={{ setAuthModalOpen, setRegisterModalOpen }} />
            {isAuthModalOpen && (
                <AuthModal
                    onClose={() => {
                        setAuthModalOpen(false);
                        setSearchParams({});
                    }}
                    onLogin={handleLogin}
                />
            )}
            {isRegisterModalOpen && (
                <RegisterModal
                    onClose={() => setRegisterModalOpen(false)}
                    onSuccess={() => {
                        setRegisterModalOpen(false);
                        setAuthModalOpen(true); // Open login after success
                    }}
                />
            )}
        </>
    );
};

// Suspense Wrapper Helper - wraps lazy components
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => {
    return (props: any) => (
        <Suspense fallback={<PageLoader />}>
            <Component {...props} />
        </Suspense>
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

const CourseCreateWrapper = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" />;
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.INSTRUCTOR && user.role !== UserRole.TENANT_ADMIN) {
        return <Navigate to="/dashboard" />;
    }
    return <CourseCreate />;
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

    // Map Turkish URL slugs to English category keys
    const categoryMap: Record<string, 'ebooks' | 'videos' | 'live' | 'assignments' | 'quizzes' | 'exams'> = {
        'kitaplar': 'ebooks',
        'videolar': 'videos',
        'canli': 'live',
        'odevler': 'assignments',
        'quizler': 'quizzes',
        'sinavlar': 'exams'
    };

    const validCategory = categoryMap[category || ''] || 'ebooks';

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
    const { setAuthModalOpen, setRegisterModalOpen } = useOutletContext<{
        setAuthModalOpen: (open: boolean) => void;
        setRegisterModalOpen: (open: boolean) => void;
    }>();
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && user) {
            navigate('/akademi-secimi');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <LandingPage
        onLoginClick={() => setAuthModalOpen(true)}
        onRegisterClick={() => setRegisterModalOpen(true)}
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
                    { path: 'egitim/ekle', element: <CourseCreateWrapper /> },
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
                    { path: 'egitimlerim/kurs-olustur', element: <EducationManager category="documents" /> },
                    { path: 'egitimlerim/:category', element: <EducationWrapper /> },
                    // Instructor Pages
                    { path: 'ogretmen/canli-dersler', element: <LiveClassManager /> },
                    { path: 'ogretmen/odevler', element: <AssignmentManager /> },
                    { path: 'ogretmen/quizler', element: <QuizManager /> },
                    { path: 'ogretmen/sinavlar', element: <ExamManager /> },
                ]
            }
        ]
    }
]);
