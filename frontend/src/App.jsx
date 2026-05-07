import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RecoverPassword from './pages/auth/RecoverPassword';
import { useEffect } from 'react';
import { checkAuthUser } from './store/authSlice';
import { useDispatch } from 'react-redux';

const HomePage = lazy(() => import('./pages/home').then((module) => ({ default: module.HomePage })));
const DashboardPage = lazy(() => import('./pages/dashboard').then((module) => ({ default: module.DashboardPage })));
const SignInPage = lazy(() => import('./pages/auth').then((module) => ({ default: module.SignInPage })));
const SignUpPage = lazy(() => import('./pages/auth').then((module) => ({ default: module.SignUpPage })));
const OtpVerificationPage = lazy(() =>
  import('./pages/auth').then((module) => ({ default: module.OtpVerificationPage }))
);
const RecoverPassword = lazy(() =>
  import('./pages/auth').then((module) => ({ default: module.RecoverPassword }))
);
const ProtectedRoute = lazy(() => import('./pages/auth').then((module) => ({ default: module.ProtectedRoute })));
const AdminRoute = lazy(() => import('./pages/admin/AdminRoute.jsx'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage.jsx'));

const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl border-[3px] border-black bg-white/70 ${className}`} />
);

const AppSkeleton = () => (
  <main
    className="min-h-screen bg-[#1E6BFF] p-4 font-sans text-slate-950 sm:p-6"
    style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
      backgroundSize: '34px 34px',
    }}
  >
    <div className="grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden rounded-2xl border-[4px] border-black bg-[#00E676] p-4 shadow-[8px_8px_0_#0F172A] lg:grid lg:content-start lg:gap-4">
        <SkeletonBlock className="h-12 w-36 bg-white/80" />
        <SkeletonBlock className="h-10" />
        <SkeletonBlock className="h-10" />
        <SkeletonBlock className="h-10" />
        <SkeletonBlock className="h-10" />
      </aside>

      <section className="grid content-start gap-4">
        <header className="rounded-2xl border-[4px] border-black bg-white p-4 shadow-[6px_6px_0_#0F172A]">
          <div className="flex items-center justify-between gap-4">
            <div className="grid gap-2">
              <SkeletonBlock className="h-3 w-28 bg-[#BFE8FF]" />
              <SkeletonBlock className="h-8 w-52 bg-slate-100" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-10 w-10 bg-[#FFD600]" />
              <SkeletonBlock className="h-10 w-28 bg-[#00E676]" />
            </div>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonBlock className="h-28 bg-white" />
          <SkeletonBlock className="h-28 bg-white" />
          <SkeletonBlock className="h-28 bg-white" />
          <SkeletonBlock className="h-28 bg-white" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <SkeletonBlock className="h-80 bg-white" />
          <SkeletonBlock className="h-80 bg-white" />
        </div>
      </section>
    </div>
  </main>
);

const App = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(checkAuthUser())
  },[dispatch])
  return (
    <Suspense fallback={<AppSkeleton />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<ProtectedRoute> <SignInPage /></ProtectedRoute>} />
        <Route path="/signup" element={<ProtectedRoute ><SignUpPage /></ProtectedRoute>} />
        <Route path='/reset-password' element={<RecoverPassword/>}/>
        <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
        <Route
          path="/dashboard/:view"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
