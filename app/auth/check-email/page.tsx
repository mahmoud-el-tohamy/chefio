"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./checkEmail.module.css";

export default function CheckEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // 'forgot' or 'signup'

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleVerify = () => {
    if (type === "forgot") {
      router.push("./reset-password");
    } else if (type === "signup") {
      router.push("../../home");
    }
  };

  const handleSendAgain = () => {
    setIsResendDisabled(true); 
    setTimeLeft(180); 
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Check your email</h1>
      <p className={styles.subtitle}>We&apos;ve sent the code to your email</p>

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
          />
        ))}
      </div>

      <p className={styles.expireText}>
        Code expires in:{" "}
        <span className={styles.expireTime}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </p>

      <button className={styles.verifyButton} onClick={handleVerify}>
        Verify
      </button>

      <button
        className={styles.sendAgainButton}
        onClick={handleSendAgain}
        disabled={isResendDisabled}
      >
        Send again
      </button>
    </div>
  );
}
