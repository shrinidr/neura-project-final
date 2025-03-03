
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
const Header = () => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();
    const [loggedIn, changeLoggedIn] = useState<Boolean> (false)
    useEffect(() => {
    // Redirect if already signed in
    if (isSignedIn) {
        changeLoggedIn(true)
    }
    }, [isSignedIn]);

    const { signOut } = useClerk();

    const handleSignOut = () => {
        changeLoggedIn(false);
        signOut();
    };

    const handleContactUsClick = () => {
        navigate("/contact-us"); // Redirect to your custom sign-in page
      };
    
      const handleAIButton = () => {
        navigate("/privacy");
      }
    
    return (
        <>
        <div className="container">
                <img src="/neura-removebg-preview.png" />
                <Link to ='/'>  <p id="title"><b> Neura </b> </p> </Link>
                <button className="Btn" id = "btn1" key = "btn1" onClick={handleContactUsClick}> Contact Us</button>
                <button className="Btn" id=  "btn2" key = "btn2" onClick={handleAIButton}> AI </button>
                {loggedIn == false ?<Link to = '/sign-in'><button className="Btn" id= "btn3" key = "btn3"> Login </button></Link>:
                <button className="Btn" id= "btn3" key = "btn3" onClick={handleSignOut}>Sign Out</button>}

        </div>
        </>
    );
}

export default Header;
