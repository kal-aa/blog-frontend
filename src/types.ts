export interface ErrorState {
  message: string | null;
}

export interface FirebaseError {
  code?: string;
  message?: string;
}

export type EmailLoginFormData = {
  email: string;
  password: string;
};

// User context type
export type UserType = {
  id: string;
  name: string;
} | null;

export type UserContextType = {
  user: UserType;
  setUser: (user: UserType) => void;
};

export type LoginProps = {
  emailLogin: (formData: EmailLoginFormData) => Promise<void>;
  googleSignIn: () => Promise<void>;
  githubSignIn: () => Promise<void>;
};
