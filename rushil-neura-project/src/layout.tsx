import { useLocation } from "react-router-dom";
import React from "react";
import './styles/basic.css'
import './styles/home.css'
import './styles/james.css'



interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isSpecialPage = location.pathname === '/'; // Adjust this to your specific route

  return (
    <div className={isSpecialPage ? 'special-background' : 'default-background'}>
      {children}
    </div>
  );
};

export default Layout;