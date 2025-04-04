import { useAuth } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
const Navbar = () => {
  const { isSignedIn } = useAuth(); // Get auth status from Clerk
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleLoginClick = () => {
    navigate("/sign-in"); // Redirect to your custom sign-in page
  };

  const handleContactUsClick = () => {
    navigate("/contact-us"); // Redirect to your custom sign-in page
  };

  const handleAIButton = () => {
    navigate("/privacy");
  }

  return (
    <div className="navbar">
      <img src="/neura-removebg-preview.png" className="homePageBackground" />
      <Link to="/">
        <p id="title"><b>Neura</b></p>
      </Link>
       <button className="Btn" id="btn1" key="btn1" onClick={handleContactUsClick}>Contact Us</button>
      <button className="Btn" id="btn2" key="btn2" onClick={handleAIButton}>AI</button>

      {isSignedIn ? (
        <SignOutButton>
          <button className="Btn" id="btn3" key="btn3">Sign Out</button>
        </SignOutButton>
      ) : (
        <button className="Btn" id="btn3" key="btn3" onClick={handleLoginClick}>
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;