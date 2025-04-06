// SignUpPage.tsx
/*import { CSSProperties } from 'react';
import { SignUp, useSignUp, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';

import axios from 'axios';
const SignUpPage = () => {

  const { isSignedIn } = useAuth();
  const { signUp } = useSignUp(); // Using the useSignUp hook to access signup information

  {/*useEffect(() => {
    // Redirect if already signed in
    if (isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, navigate]);


  const handleCompleteSignUp = async () => {
    if (signUp && signUp.createdUserId) {
      try {
        // Making the API call to backend once sign-up is completed

        console.log('Attempting to make a request to backend to save user data');
        console.log('UserID:', signUp.createdUserId);
        console.log('Email Address:', signUp.emailAddress);

        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
          userId: signUp.createdUserId,
          email: signUp.emailAddress,
        }, { withCredentials: true });
        console.log('User saved to backend, navigating to home...');
        //navigate('/'); // Redirect after successful sign-up and backend creation
      } catch (error) {
        console.error('Error creating user in MongoDB:', error);
      }
    }
  };

  // If the signUp object is loaded and signup completed, trigger handleCompleteSignUp
{/* useEffect(() => {
    if (isLoaded && signUp && signUp.createdUserId) {
      console.log("User ID:", signUp.createdUserId);
      console.log("Email Address:", signUp.emailAddress);
      handleCompleteSignUp();
    }
  }, [isLoaded, signUp]);



  useEffect(() => {
    if (isSignedIn && signUp && signUp.createdUserId) {
      console.log("User ID:", signUp.createdUserId);
      console.log("Email Address:", signUp.emailAddress);
      // Now the user is signed in and has completed email verification
      handleCompleteSignUp();
    }
  }, [isSignedIn, signUp]);

  return (
    <div style={styles.container}>
      <SignUp
        routing='virtual'
        signInUrl="/sign-in"
        appearance={{
          elements: {
            card: styles.card, // Customize the card style
            formButtonPrimary: styles.formButtonPrimary, // Customize the form's primary button
            headerTitle: styles.headerTitle, // Style for header title if needed
            footerActionText: styles.footerText, // Footer text (e.g. "Don't have an account?")
          },
        }}/>
    </div>
  );
};




const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    paddingTop: '55px',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  card: {
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  formButtonPrimary: {
    backgroundColor: '#5c67f2', // Customize button color
  },
  footerText: {
    color: '#666', // Customize the footer text color
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export default SignUpPage;*/

import { RedirectToSignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return <RedirectToSignUp redirectUrl="/home?newUser=true"/>;
};

export default SignUpPage;
