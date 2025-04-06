import { RedirectToSignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return <RedirectToSignUp signUpFallbackRedirectUrl='/call-back'/>;
};

export default SignUpPage;
