export const metadata = {
  title: "Chefio | Sign Up",
};

import React from "react";
import AuthForm from "@/components/AuthForm";

const SignupPage: React.FC = () => {
  return <AuthForm type="signup" />;
};

export default SignupPage;
