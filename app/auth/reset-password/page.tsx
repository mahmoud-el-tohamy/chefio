"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./resetPassword.module.css";
import { authService } from "@/services/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get email from localStorage
    const email = localStorage.getItem('resetEmail');
    if (email) {
      setUserEmail(email);
    } else {
      // If no email is found, redirect to forgot password page
      router.push('/auth/forgot');
    }
  }, [router]);

  // Password requirements
  const isLengthValid = password.length >= 8;
  const containsNumber = /\d/.test(password);
  const containsUppercase = /[A-Z]/.test(password);
  const containsLowercase = /[a-z]/.test(password);
  const containsSpecialChar = /[@$!%*?&#]/.test(password);

  // Check if all conditions are met
  const isPasswordValid =
    isLengthValid &&
    containsNumber &&
    containsUppercase &&
    containsLowercase &&
    containsSpecialChar;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await authService.resetPassword(userEmail, password);
      
      if (response.success) {
        // Clear the reset email from localStorage
        localStorage.removeItem('resetEmail');
        // Redirect to login page
        router.push("/auth/login");
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reset your password</h1>
      <p className={styles.subtitle}>Please enter your new password</p>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <div className={styles.iconWrapper}>
            <Image
              src="/icons/lock.svg"
              alt="Lock Icon"
              width={20}
              height={20}
              className={styles.inputIcon}
            />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="button"
            className={styles.toggleButton}
            onClick={togglePasswordVisibility}
            disabled={isLoading}
          >
            <Image
              src={showPassword ? "/icons/eye-off.svg" : "/icons/eye.svg"}
              alt="Toggle Password Visibility"
              width={20}
              height={20}
              className={styles.toggleIcon}
            />
          </button>
        </div>

        <div className={styles.requirements}>
          <ul>
            <li className={isLengthValid ? styles.valid : styles.invalid}>
              {isLengthValid ? "✓" : "✕"} At least 8 characters
            </li>
            <li className={containsNumber ? styles.valid : styles.invalid}>
              {containsNumber ? "✓" : "✕"} Contains a number
            </li>
            <li className={containsUppercase ? styles.valid : styles.invalid}>
              {containsUppercase ? "✓" : "✕"} Contains an uppercase letter
            </li>
            <li className={containsLowercase ? styles.valid : styles.invalid}>
              {containsLowercase ? "✓" : "✕"} Contains a lowercase letter
            </li>
            <li className={containsSpecialChar ? styles.valid : styles.invalid}>
              {containsSpecialChar ? "✓" : "✕"} Contains a special character (@$!%*?&#)
            </li>
          </ul>
        </div>

        <button 
          type="submit" 
          className={styles.button} 
          disabled={!isPasswordValid || isLoading}
        >
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
