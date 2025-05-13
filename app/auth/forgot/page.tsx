"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./forgot.module.css";

export default function ForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("./check-email?type=forgot");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Password recovery</h1>
      <p className={styles.subtitle}>
        Enter your email to recover your password
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Your email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Sign In
        </button>
      </form>
    </div>
  );
}
