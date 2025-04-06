import { RedirectToSignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return <RedirectToSignIn signInForceRedirectUrl= '/home'/>;
};

export default SignInPage;

