"use client";

import React from "react";
import Link from "next/link";
import FoodImages from "@/components/FoodImages";
import Button from "@/components/Button";
import CustomLink from "@/components/CustomLink";
import styles from "@/styles/WelcomePage.module.css";

const LandingPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <FoodImages />

      <div className={styles.content}>
        <h1 className={styles.title}>
          Start Cooking <span className={styles.brand}>With Chefio</span>
        </h1>
        <p className={styles.subtitle}>
          Let&apos;s join our community to cook better food!
        </p>

        <Link href="auth/signup">
          <Button text="Get Started" />
        </Link>

        <p className={styles.loginText}>
          Already have an account? <CustomLink href="auth/login" text="Log In" />
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
