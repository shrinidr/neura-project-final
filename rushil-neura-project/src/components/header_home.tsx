import { useAuth } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { useState } from "react";
import '../styles/HomePage/header_home.css';

const HeaderHome = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginClick = () => {
    navigate("/sign-in");
    setMenuOpen(false);
  };
  const handleContactUsClick = () => {
    navigate("/contact-us");
    setMenuOpen(false);
  };
  const handleAIButton = () => {
    navigate("/privacy");
    setMenuOpen(false);
  };

  return (
    <>
      <div className="navbar">
        <Link to="/" className="logo-container">
          <img src="/neura-removebg-preview.png" className="ideknowman" />
          <p id="title"><b>Neura</b></p>
        </Link>

        <div className="nav-buttons">
          <button className="Btn" onClick={handleContactUsClick}>Contact Us</button>
          <button className="Btn" onClick={handleAIButton}>AI</button>
          {isSignedIn ? (
            <SignOutButton>
              <button className="Btn">Sign Out</button>
            </SignOutButton>
          ) : (
            <button className="Btn" onClick={handleLoginClick}>Login</button>
          )}
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(prev => !prev)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div className={`homePagesidebar ${menuOpen ? 'open' : ''}`}>
        <button className="Btn sidebar-btn" onClick={handleContactUsClick}>Contact Us</button>
        <button className="Btn sidebar-btn" onClick={handleAIButton}>AI</button>
        {isSignedIn ? (
          <SignOutButton>
            <button className="Btn sidebar-btn">Sign Out</button>
          </SignOutButton>
        ) : (
          <button className="Btn sidebar-btn" onClick={handleLoginClick}>Login</button>
        )}
        
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default HeaderHome;
