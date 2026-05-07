<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { getCurrentUser, setCurrentUser } from '../../services/authApi';

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking'); // checking | authed | unauthed
  const user = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (user) {
          if (!cancelled) setStatus('authed');
          return;
        }

        const res = await axiosInstance.get('/auth/me');
        const me = res?.data?.user || null;
        if (me) {
          setCurrentUser(me);
          if (!cancelled) setStatus('authed');
        } else {
          if (!cancelled) setStatus('unauthed');
        }
      } catch {
        if (!cancelled) setStatus('unauthed');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (status === 'checking') {
    return null;
  }

  if (status === 'unauthed') {
=======
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(state => state.auth);
console.log(user,isAuthenticated)
  if (!isAuthenticated && location.pathname.includes("/dashboard")) {
>>>>>>> 65e3716 (feat: my auth and dashboard updated)
    return <Navigate to="/signin" replace />;
  }

  // Agar user authenticated hai aur signin/signup page par jana chahe toh use dashboard par redirect karein
  if (isAuthenticated && (location.pathname === "/signin" || location.pathname === "/signup")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;