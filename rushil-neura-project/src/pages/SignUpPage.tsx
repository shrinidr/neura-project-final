import { RedirectToSignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return <RedirectToSignUp redirectUrl="/call-back" />;
};

export default SignUpPage;
