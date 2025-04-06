import { RedirectToSignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return <RedirectToSignUp signUpForceRedirectUrl='/call-back'/>;
};

export default SignUpPage;


/**Pls do not touch this code. I have spent wayyy too much time perfectly aligning 
 * poorly defined parameter strings so that sign up flows loads ONLY after sign up and sign
 * in works as required. God. 
 */