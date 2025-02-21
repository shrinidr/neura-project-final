
import { Link } from 'react-router-dom';
import {useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';

const HeaderHome = () => {


  const { isSignedIn } = useAuth();
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

  return (
        <>
          <div className="navbar">
            <div className="logo-container">
              <img src="/neura-removebg-preview.png" className="homePageBackground" alt="Neura Logo" />
              <Link to="/" className="title-link">
                <p id="title"><b>Neura</b></p>
              </Link>
            </div>
            <div className="button-container">
              <button className="Btn" id="btn1">
                <Link to="/contact">
                  <span>Contact Us</span>
                </Link>
              </button>
              <button className="Btn" id="btn2"><span>AI</span></button>
              {loggedIn === false ? (
                <Link to='/sign-in'>
                  <button className="Btn" id="btn3">Login</button>
                </Link>
              ) : (
                <button className="Btn" id="btn3" onClick={handleSignOut}>Sign Out</button>
              )}
            </div>
          </div>
        </>
    );
}

export default HeaderHome;