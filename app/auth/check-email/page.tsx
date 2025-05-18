"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./checkEmail.module.css";
import { authService } from "@/services/auth";

export default function CheckEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // 'forgot' or 'signup'

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Get email based on the type
    const email = type === 'forgot' 
      ? localStorage.getItem('resetEmail')
      : JSON.parse(localStorage.getItem('user') || '{}')?.email;
    
    if (email) {
      setUserEmail(email);
    } else {
      // If no email is found, redirect to appropriate page
      router.push(type === 'forgot' ? '/auth/forgot' : '/auth/signup');
    }
  }, [type, router]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    if (!digit) return;

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);

    try {
      const providedCode = code.join("");
      
      if (type === 'forgot') {
        const response = await authService.verifyForgotPasswordCode(userEmail, providedCode);
        if (response.success) {
          router.push("./reset-password");
        } else {
          setError(response.message);
        }
      } else {
        const response = await authService.verifyCode(userEmail, providedCode);
        if (response.success) {
          router.push("../../home");
        } else {
          setError(response.message);
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAgain = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      if (type === 'forgot') {
        const response = await authService.sendForgotPasswordCode(userEmail);
        if (response.success) {
          setIsResendDisabled(true);
          setTimeLeft(180);
        } else {
          setError(response.message);
        }
      } else {
        const response = await authService.sendVerificationCode(userEmail);
        if (response.success) {
          setIsResendDisabled(true);
          setTimeLeft(180);
        } else {
          setError(response.message);
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Check your email</h1>
      <p className={styles.subtitle}>
        We&apos;ve sent the code to{" "}
        <span className={styles.emailHighlight}>{userEmail}</span>
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.codeContainer}>
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            className={styles.codeInput}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            inputMode="numeric"
            pattern="[0-9]*"
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            disabled={isLoading}
          />
        ))}
      </div>

      <p className={styles.expireText}>
        Code expires in:{" "}
        <span className={styles.expireTime}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </p>

      <button 
        className={styles.verifyButton} 
        onClick={handleVerify}
        disabled={isLoading || code.some(digit => !digit)}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      <button
        className={styles.sendAgainButton}
        onClick={handleSendAgain}
        disabled={isResendDisabled || isLoading}
      >
        {isLoading ? "Sending..." : "Send again"}
      </button>
    </div>
  );
}
