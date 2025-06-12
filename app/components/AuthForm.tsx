"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // For routing in app router
import styles from "../styles/auth.module.css";
import { AuthFormProps, FormValues } from "@/types/auth";
import { authService } from "@/services/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = "652192691165-mbp1aa6qi6l9bnou7ltg3vd6uq7icdrn.apps.googleusercontent.com";

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();
  const isLogin = type === "login";
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Ref to store the actual clickable Google button element (rendered by Google API)
  const googleActualButtonRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      try {
        console.log('Initializing Google Sign-In...');
        if (!window.google) {
          console.error('Google Sign-In script not loaded');
          setError('Google Sign-In is not available. Please try again later.');
          return;
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin',
          ux_mode: 'popup',
          flow: 'implicit'
        });

        console.log('Google Sign-In initialized, rendering hidden button...');
        const buttonElement = document.getElementById('googleSignInButton'); // This is the div for the hidden button
        if (!buttonElement) {
          console.error('Google Sign-In button element not found for rendering.');
          setError('Failed to set up Google Sign-In button. Please refresh the page.');
          return;
        }

        // Render the actual Google button into the now hidden div
        window.google.accounts.id.renderButton(
          buttonElement,
          {
            type: 'standard',
            theme: 'outline', // Theme doesn't matter for a hidden button
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          }
        );

        // Use MutationObserver to find the actual clickable element within the rendered button
        // This is necessary because the Google button is rendered within an iframe/shadow DOM.
        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              const actualGoogleButton = buttonElement.querySelector('div[role="button"]'); // Look for the clickable element
              if (actualGoogleButton) {
                googleActualButtonRef.current = actualGoogleButton as HTMLElement;
                console.log('Actual Google button element found and referenced.');
                observer.disconnect(); // Stop observing once found
                break;
              }
            }
          }
        });
        observer.observe(buttonElement, { childList: true, subtree: true });

        console.log('Google Sign-In hidden button rendered.');
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        setError('Failed to initialize Google Sign-In. Please refresh the page and try again.');
      }
    };

    initializeGoogleSignIn();
    // No need for setTimeout if MutationObserver is reliable, but keeping it for robustness
    const timer = setTimeout(initializeGoogleSignIn, 1000);

    return () => clearTimeout(timer); // Clean up timeout
  }, []);

  // Function to handle click on our custom button
  const handleCustomGoogleButtonClick = () => {
    if (googleActualButtonRef.current) {
      console.log('Triggering click on hidden Google Sign-In button.');
      googleActualButtonRef.current.click(); // Programmatically click the hidden Google button
    } else {
      setError('Google Sign-In service not fully loaded. Please try again.');
      console.error('Cannot find reference to Google Sign-In button.');
    }
  };

  const handleGoogleSignIn = async (response: any) => {
    try {
      setFormLoading(true);
      setError("");
      console.log('Full Google Sign-In response:', response);
      
      if (!response.credential) {
        console.error('No credential received from Google');
        setError('Failed to get credentials from Google. Please try again.');
        return;
      }

      // The credential from Google is the ID token
      const idToken = response.credential;
      console.log('ID token from Google:', idToken);
      
      // Ensure the token is properly formatted
      if (!idToken || typeof idToken !== 'string' || idToken.trim() === '') {
        console.error('Invalid ID token received from Google');
        setError('Failed to get valid credentials from Google. Please try again.');
        return;
      }

      console.log('Sending ID token to backend...');
      const result = await authService.googleSignIn(idToken);
      console.log('Backend response:', result);

      if (result.accessToken) {
        console.log('Sign-in successful, redirecting...');
        router.push('/home');
      } else {
        console.error('No access token in response');
        setError('Failed to sign in. Please try again.');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const passwordValue = watch("password") || "";
  // Define usernameValue using watch
  const usernameValue: string = watch("username") || "";

  // Password requirements:
  const hasLowerCase = /[a-z]/.test(passwordValue);
  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasDigit = /\d/.test(passwordValue);
  const hasSpecialChar = /[@$!%*?&#]/.test(passwordValue);
  const isMinLength = passwordValue.length >= 8;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setFormLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        // Signin flow
        const response = await authService.signin({
          email: data.email,
          password: data.password
        });

        if (response.success) {
          router.push("/home");
        } else {
          setError(response.message);
        }
      } else {
        // Signup flow
        const response = await authService.signup({
          username: data.username!,
          email: data.email,
          password: data.password
        });

        if (response.success) {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(response.result));
          
          // Send verification code
          await authService.sendVerificationCode(data.email);
          
          // Navigate to check-email page
          router.push("/auth/check-email?type=signup");
        } else {
          setError(response.message);
        }
      }
    } catch (error: any) {
      setError(error.message || (isLogin ? 'Login failed' : 'Signup failed'));
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isLogin ? "Welcome Back to " : "Welcome to "}
        <span className={styles.brand}>Chefio!</span>
      </h1>

      <p className={styles.subtitle}>Please enter your account here</p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} aria-label={isLogin ? "Login form" : "Signup form"}>
        {error && <div className={styles.error}>{error}</div>}
        {/* Email field */}
        <div className={styles.inputGroup}>
          <div className={styles.inputAndIcon}>
            <div className={styles.iconWrapper}>
              <Image
                src="/icons/email.svg"
                alt="Email Icon"
                width={20}
                height={20}
                className={styles.inputIcon}
              />
            </div>
            <input
              type="text"
              placeholder="Email or phone number"
              className={styles.input}
              autoComplete="email"
              aria-label="Email or phone number"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        {/* Username field appears only when Sign Up */}
        {!isLogin && (
          <div className={styles.inputGroup}>
            <div className={styles.inputAndIcon}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/icons/user.svg" // Make sure user.svg exists in /public/icons
                  alt="User Icon"
                  width={20}
                  height={20}
                  className={styles.inputIcon}
                />
              </div>
              <input
                type="text"
                placeholder="Username"
                className={styles.input}
                autoComplete="username"
                aria-label="Username"
                {...register("username", {
                  required: "Username is required",
                  validate: {
                    noSpaces: (usernameValue) =>
                      /^[A-Za-z0-9_.]+$/.test(usernameValue || "") ||
                      "Username cannot contain spaces",
                    englishOnly: (value) =>
                      /^[A-Za-z0-9_.]+$/.test(value || "") ||
                      "Only letters, numbers, '_' and '.' allowed",
                  },
                })}
              />
            </div>
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>
        )}

        {/* Password field */}
        <div className={styles.inputGroup}>
          <div className={styles.inputAndIcon}>
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
              placeholder="Password"
              className={styles.input}
              aria-label="Password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                  message:
                    "Must include uppercase, lowercase, digit, special char, and be at least 8 characters long",
                },
              })}
            />
            <div
              className={styles.toggleIconWrapper}
              onClick={togglePasswordVisibility}
            >
              <Image
                src={showPassword ? "/icons/eye-off.svg" : "/icons/eye.svg"}
                alt="Toggle Password Visibility"
                width={20}
                height={20}
                className={styles.toggleIcon}
                title="Show/Hide Your Password"
              />
            </div>
          </div>
          <div className={styles.errorAndForgot}>
            {isLogin && (
              <Link href="../auth/forgot" className={styles.forgotPassword} aria-label="Forgot password?">
                Forgot password?
              </Link>
            )}
            {isLogin && errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Password requirements (for Sign Up) */}
        {!isLogin && (
          <div className={styles.passwordRequirements}>
            <ul>
              <li className={hasLowerCase ? styles.valid : styles.invalid}>
                {hasLowerCase ? "✓" : "✕"} At least one lowercase letter
              </li>
              <li className={hasUpperCase ? styles.valid : styles.invalid}>
                {hasUpperCase ? "✓" : "✕"} At least one uppercase letter
              </li>
              <li className={hasDigit ? styles.valid : styles.invalid}>
                {hasDigit ? "✓" : "✕"} Contains a number
              </li>
              <li className={hasSpecialChar ? styles.valid : styles.invalid}>
                {hasSpecialChar ? "✓" : "✕"} Contains a special character
              </li>
              <li className={isMinLength ? styles.valid : styles.invalid}>
                {isMinLength ? "✓" : "✕"} Minimum length of 8 characters
              </li>
              <li
                className={
                  usernameValue && /^[A-Za-z0-9_.]+$/.test(usernameValue)
                    ? styles.valid
                    : styles.invalid
                }
              >
                {usernameValue && /^[A-Za-z0-9_.]+$/.test(usernameValue)
                  ? "✓"
                  : "✕"}{" "}
                Username: only letters, numbers, &apos;_&apos; and &apos;.&apos;
              </li>
            </ul>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={formLoading}
        >
          {formLoading ? (
            <div className={styles.loadingText}>
              Loading...
            </div>
          ) : (
            isLogin ? "Login" : "Sign Up"
          )}
        </button>

        <p className={styles.or}>Or continue with</p>

        {/* Custom Google Sign-In Button */}
        <button
          type="button" // Use type="button" to prevent form submission
          className={styles.googleButton} // Apply your desired styles here
          onClick={handleCustomGoogleButtonClick}
          disabled={formLoading}
          aria-label="Sign in with Google"
        >
          <Image
            src="/icons/google.svg" // Path to your Google icon
            alt="Google Logo"
            width={20}
            height={20}
            className={styles.googleIcon} // Optional: for specific icon styling
          />
          Sign in with Google
        </button>

        {/* Hidden div for Google Identity Services to render its actual button */}
        {/* This div must be present for the Google API to render the button internally */}
        <div id="googleSignInButton" style={{ display: 'none' }}></div>

        {/* Link to navigate between Login and Sign Up */}
        <p className={styles.switchAuth}>
          {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
          <Link href={isLogin ? "./signup" : "./login"} className={styles.link} aria-label={isLogin ? "Go to sign up" : "Go to login"}>
            {isLogin ? "Sign Up" : "Login"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
