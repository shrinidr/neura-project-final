import { useAuth} from '@clerk/clerk-react';
import React from 'react';
import { Navigate } from 'react-router-dom';
interface ProtectedRouteProps {
    children: React.ReactNode;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth(); // Check if user is signed in and if Clerk has finished loading

  // Wait until authentication state is fully loaded
  if (!isLoaded) {
    return <div>Loading...</div>; // Optionally, add a loading spinner or message
  }

  if (!isSignedIn) {
    // If not signed in, redirect to the sign-in page
    return <Navigate to="/" />;
  }

  // If signed in, render the children components
  return <>{children}</>;
};
export default ProtectedRoute;
