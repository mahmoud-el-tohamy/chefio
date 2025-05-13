export interface Recipe {
  id: string;
  title: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  duration: string;
  isLiked?: boolean;
}

export interface FormValues {
  email: string;
  password: string;
  username?: string;
}

export interface AuthFormProps {
  type: "login" | "signup";
}

export interface SearchResultsProps {
  query?: string;
  results: Recipe[];
  isVisible: boolean;
  onToggleLike: (recipeId: string) => void;
  onClearSearch: () => void;
} 