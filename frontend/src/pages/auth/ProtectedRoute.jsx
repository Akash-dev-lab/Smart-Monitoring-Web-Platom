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
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;

