import { RedirectToSignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return <RedirectToSignUp redirectUrl="/home?newUser=true" signUpFallbackRedirectUrl="/home?newUser=true" />;
};

export default SignUpPage;
