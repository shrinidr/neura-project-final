import { RedirectToSignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return <RedirectToSignUp redirectUrl="/callBackPage" />;
};

export default SignUpPage;
