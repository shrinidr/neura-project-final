// SignInPage.tsx
/*import { CSSProperties } from 'react';
import { SignIn } from '@clerk/clerk-react';
const SignInPage = () => {



  return (
    <div style={styles.container}>
      <SignIn
        appearance={{
          elements: {
            card: styles.card, // Customize the card style
            formButtonPrimary: styles.formButtonPrimary, // Customize the form's primary button
            headerTitle: styles.headerTitle, // Style for header title if needed
            footerActionText: styles.footerText, // Footer text (e.g. "Don't have an account?")
          },
        }}
        signUpUrl="/sign-up" // Redirect to your custom sign-up page
        fallbackRedirectUrl="/home"
      />
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
    paddingTop: '5px',
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

export default SignInPage;*/

import { RedirectToSignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return <RedirectToSignIn />;
};

export default SignInPage;

