
import { Link } from 'react-router-dom';

import { useNavigate } from "react-router-dom";
import '../styles/HomePage/header_home.css';
import { SignOutButton } from '@clerk/clerk-react';


const Header = () => {
    const navigate = useNavigate();

    const handleContactUsClick = () => {
        navigate("/contact-us"); // Redirect to your custom sign-in page
      };
    
      const handleAIButton = () => {
        navigate("/privacy");
      }
    
    return (

        <div className="navbar" style = {{top: '3vh'}}>
        <Link to="/" className="logo-container">
          <img src="/neura-removebg-preview.png" className="ideknowman" />
          <p id="title"><b>Neura</b></p>
        </Link>

        <div className="nav-buttons">
          <button className="Btn" onClick={handleContactUsClick}>Contact Us</button>
          <button className="Btn" onClick={handleAIButton}>AI</button>
            <SignOutButton>
              <button className="Btn">Sign Out</button>
            </SignOutButton>
        </div>
      </div>
    );
}

export default Header;
