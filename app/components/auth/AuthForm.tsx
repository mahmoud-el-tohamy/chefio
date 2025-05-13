"use client";

import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../styles/auth.module.css";
import { AuthFormProps, FormValues } from "../../types/auth";
import { validatePassword, areAllRequirementsMet } from "../../utils/passwordValidation";
import { useAuthForm } from "../../hooks/useAuthForm";
import FormInput from "./FormInput";
import PasswordRequirementsList from "./PasswordRequirements";

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();
  const isLogin = type === "login";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    error,
    passwordValue,
    usernameValue,
    validationRules,
  } = useAuthForm({
    type,
    onSubmit: async (data) => {
      // TODO: Replace with actual API call
      console.log("Form Data:", data);
      
      if (isLogin) {
        router.push("/home");
      } else {
        router.push("./check-email?type=signup");
      }
    },
  });

  const passwordRequirements = validatePassword(passwordValue, usernameValue);
  const allRequirementsMet = areAllRequirementsMet(passwordRequirements);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isLogin ? "Welcome Back to " : "Welcome to "}
        <span className={styles.brand}>Chefio!</span>
      </h1>

      <p className={styles.subtitle}>Please enter your account here</p>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <FormInput
          type="text"
          placeholder="Email or phone number"
          icon="/icons/email.svg"
          autoComplete="email"
          register={register}
          name="email"
          error={errors.email?.message}
        />

        {!isLogin && (
          <FormInput
            type="text"
            placeholder="Username"
            icon="/icons/user.svg"
            autoComplete="username"
            register={register}
            name="username"
            error={errors.username?.message}
          />
        )}

        <FormInput
          type="password"
          placeholder="Password"
          icon="/icons/lock.svg"
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          register={register}
          name="password"
          error={errors.password?.message}
        />

        {!isLogin && (
          <PasswordRequirementsList
            requirements={passwordRequirements}
            username={usernameValue}
          />
        )}

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={(!isLogin && !allRequirementsMet) || isLoading}
        >
          {isLoading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className={styles.or}>Or continue with</p>

        <button 
          type="button" 
          className={styles.googleButton}
          disabled={isLoading}
        >
          Google
        </button>

        <p className={styles.switchAuth}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "./signup" : "./login"} className={styles.link}>
            {isLogin ? "Sign Up" : "Login"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthForm; 