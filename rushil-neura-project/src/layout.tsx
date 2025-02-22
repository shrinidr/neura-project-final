import { useLocation } from "react-router-dom";
import React from "react";
import './styles/basic.css'
import './styles/home.css'
import './styles/james.css'
import './styles/james2.css'
import RedirectAfterAuth from "./components/redirectComponent";

interface LayoutProps {
  children: React.ReactNode;
}
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isSpecialPage = location.pathname === '/'; // Adjust this if needed

  return (
    <div className={isSpecialPage ? 'special-background' : 'default-background'}>
      <RedirectAfterAuth /> {/* Ensures redirection after login */}
      {children}
    </div>
  );
};

export default Layout;