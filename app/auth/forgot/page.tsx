"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./forgot.module.css";
import { authService } from "@/services/auth";

export default function ForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.sendForgotPasswordCode(email);
      
      if (response.success) {
        // Store email in localStorage for the verification page
        localStorage.setItem('resetEmail', email);
        router.push("./check-email?type=forgot");
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Password recovery</h1>
      <p className={styles.subtitle}>
        Enter your email to recover your password
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Your email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Please enter a valid email address"
        />
        <button 
          type="submit" 
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
    </div>
  );
}
