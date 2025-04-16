"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./resetPassword.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // متطلبات الباسوورد
  const isLengthValid = password.length >= 8;
  const containsNumber = /\d/.test(password);
  const containsUppercase = /[A-Z]/.test(password);
  const containsLowercase = /[a-z]/.test(password);
  const containsSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // التحقق من استيفاء جميع الشروط
  const isPasswordValid =
    isLengthValid &&
    containsNumber &&
    containsUppercase &&
    containsLowercase &&
    containsSpecialChar;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordValid) {
      // استدعاء API لتحديث كلمة المرور
      router.push("./login"); // أو صفحة تأكيد/نجاح
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reset your password</h1>
      <p className={styles.subtitle}>Please enter your new password</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className={styles.toggle} onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"}
          </span>
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
              {containsSpecialChar ? "✓" : "✕"} Contains a special character
            </li>
          </ul>
        </div>

        <button type="submit" className={styles.button} disabled={!isPasswordValid}>
          Done
        </button>
      </form>
    </div>
  );
}
