export const metadata = {
  title: "Chefio | Sign Up",
};

import React from "react";
import AuthForm from "@/components/AuthForm";
import Head from "next/head";

const SignupPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Chefio | Sign Up</title>
        <meta name="description" content="Sign up for Chefio to discover, share, and save your favorite recipes." />
      </Head>
      <AuthForm type="signup" />
    </>
  );
};

export default SignupPage;
