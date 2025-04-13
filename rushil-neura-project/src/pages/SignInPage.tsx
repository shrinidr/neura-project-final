

/*import { SignIn} from "@clerk/clerk-react";
import '../styles/signIn.css';

const SignInPage: React.FC = () => {
  return (
    <div className="signin-container">
      <SignIn
        signUpUrl="/sign-up"
        forceRedirectUrl="/home"
      />
    </div>
  );
};


export default SignInPage;*/



import { useEffect, useState } from "react";
import { FaDesktop } from "react-icons/fa"; // optional icon lib
import { SignIn} from "@clerk/clerk-react"
import '../styles/SignInPage/signin.css';
const SignInPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-message">
        <FaDesktop size={60} style={{ marginBottom: "1rem", color: "#663dff", marginTop: '-100px' }} />
        <h2>Please sign in using a desktop device</h2>
        <p>We're working on optimizing the mobile experience.</p>
      </div>
    );
  }

  return (
    <div className="signin-container">
      <SignIn
        signUpUrl="/sign-up"
        forceRedirectUrl="/home"
      />
    </div>
  );
};

export default SignInPage;

