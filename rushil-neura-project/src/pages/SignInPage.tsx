import { RedirectToSignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return <RedirectToSignIn redirectUrl="/home"/>;
};

export default SignInPage;

