import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormValues } from "../types/auth";
import { DEFAULT_VALIDATION_RULES } from "../types/validation";

/**
 * Props for the useAuthForm hook
 */
interface UseAuthFormProps {
  /** The type of authentication form (login or signup) */
  type: "login" | "signup";
  /** Function to handle form submission */
  onSubmit: SubmitHandler<FormValues>;
}

/**
 * Custom hook for handling authentication forms
 * @param props - Hook props
 * @returns Object containing form state and handlers
 */
export const useAuthForm = ({ type, onSubmit }: UseAuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      username: type === "signup" ? "" : undefined,
    },
  });

  const passwordValue = watch("password") || "";
  const usernameValue = watch("username") || "";

  /**
   * Handles form submission with loading and error states
   * @param data - Form data
   */
  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    /** React Hook Form register function */
    register,
    /** Form submission handler */
    handleSubmit: handleFormSubmit,
    /** Function to watch form values */
    watch,
    /** Form validation errors */
    errors,
    /** Loading state */
    isLoading,
    /** Error message */
    error,
    /** Current password value */
    passwordValue,
    /** Current username value */
    usernameValue,
    /** Default validation rules */
    validationRules: DEFAULT_VALIDATION_RULES,
  };
}; 