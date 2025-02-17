
/*import { Link } from 'react-router-dom';
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
                <img src="/neura-removebg-preview.png" className = "homePageBackground"/>
                <Link to ='/'>  <p id="title"><b> Neura </b> </p> </Link>
                <button className="Btn" id = "btn1" key = "btn1"> About Us</button>
                <button className="Btn" id=  "btn2" key = "btn2"> AI </button>
                {loggedIn == false ?<Link to = '/sign-in'><button className="Btn" id= "btn3" key = "btn3"> Login </button></Link>:
                <button className="Btn" id= "btn3" key = "btn3" onClick={handleSignOut}>Sign Out</button>}

        </div>
        </>
    );
}

export default HeaderHome;*/


import { SignInButton, SignOutButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isSignedIn } = useAuth(); // Get auth status from Clerk

  return (
    <div className="navbar">
      <img src="/neura-removebg-preview.png" className="homePageBackground" />
      <Link to="/">
        <p id="title"><b>Neura</b></p>
      </Link>
      <button className="Btn" id="btn1" key="btn1">About Us</button>
      <button className="Btn" id="btn2" key="btn2">AI</button>

      {isSignedIn ? (
        <SignOutButton>
          <button className="Btn" id="btn3" key="btn3">Sign Out</button>
        </SignOutButton>
      ) : (
        <SignInButton mode="redirect">
          <button className="Btn" id="btn3" key="btn3">Login</button>
        </SignInButton>
      )}
    </div>
  );
};

export default Navbar;

