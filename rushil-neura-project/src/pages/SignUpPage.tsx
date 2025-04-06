import { RedirectToSignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return <RedirectToSignUp signUpForceRedirectUrl= '/call-back'/>;
};

export default SignUpPage;
