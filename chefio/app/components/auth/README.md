# Authentication Components

This directory contains components and hooks for handling user authentication in the application.

## Components

### AuthForm
The main authentication form component that handles both login and signup functionality.

#### Props
- `type`: "login" | "signup" - Determines whether to show login or signup form

### FormInput
A reusable form input component with icon support and error handling.

#### Props
- `type`: string - Input type (text, password, etc.)
- `placeholder`: string - Placeholder text
- `icon`: string - Path to icon image
- `autoComplete`: string - HTML autocomplete attribute
- `showPassword`: boolean - Whether to show password (for password inputs)
- `togglePasswordVisibility`: () => void - Function to toggle password visibility
- `register`: UseFormRegister<T> - React Hook Form register function
- `name`: string - Form field name
- `error`: string - Error message
- `label`: string - Input label
- `required`: boolean - Whether the field is required

### PasswordRequirements
Component that displays password requirements and their validation status.

#### Props
- `requirements`: PasswordRequirements - Object containing requirement validation status
- `username`: string - Current username value

## Hooks

### useAuthForm
Custom hook for handling authentication forms.

#### Parameters
- `type`: "login" | "signup" - Form type
- `onSubmit`: (data: FormValues) => Promise<void> - Form submission handler

#### Returns
- `register`: UseFormRegister<FormValues> - Form registration function
- `handleSubmit`: (data: FormValues) => Promise<void> - Form submission handler
- `watch`: (field: string) => any - Function to watch form values
- `errors`: Record<string, any> - Form validation errors
- `isLoading`: boolean - Loading state
- `error`: string | null - Error message
- `passwordValue`: string - Current password value
- `usernameValue`: string - Current username value
- `validationRules`: ValidationRules - Default validation rules

## Usage Example

```tsx
import { AuthForm } from './components/auth/AuthForm';

const LoginPage = () => {
  return <AuthForm type="login" />;
};

export default LoginPage;
``` 