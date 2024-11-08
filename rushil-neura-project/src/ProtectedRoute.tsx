import { useAuth} from '@clerk/clerk-react';
import React from 'react';
import { Navigate } from 'react-router-dom';
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn } = useAuth(); // Check if user is signed in

    if (!isSignedIn) {
    // If not signed in, redirect to the sign-in page
        return <Navigate to="/" />;
    }

  // If signed in, render the children components
    return <>{children}</>;
};

export default ProtectedRoute;
