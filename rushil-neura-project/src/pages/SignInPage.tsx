

import { SignIn} from "@clerk/clerk-react";
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


export default SignInPage;
