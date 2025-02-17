import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RedirectAfterAuth = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Define pages where the redirect should happen
  const authPages = ["/sign-in", "/sign-up"];

  useEffect(() => {
    if (isSignedIn && authPages.includes(location.pathname)) {
      navigate("/home"); // Redirect only from auth pages
    }
  }, [isSignedIn, location.pathname, navigate]);

  return null;
};

export default RedirectAfterAuth;
