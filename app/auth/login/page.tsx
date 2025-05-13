export const metadata = {
  title: "Chefio | Login",
};

import React from "react";
import AuthForm from "@/components/AuthForm";
import Head from "next/head";

const LoginPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Chefio | Login</title>
        <meta name="description" content="Login to Chefio to discover, share, and save your favorite recipes." />
      </Head>
      <AuthForm type="login" />
    </>
  );
};

export default LoginPage;
