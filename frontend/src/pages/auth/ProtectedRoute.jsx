import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authApi';

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;

