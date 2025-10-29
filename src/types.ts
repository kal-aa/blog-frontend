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

export type EmailSignupFormData = EmailLoginFormData & { image?: File | null };

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
  googleSignin: () => Promise<void>;
  githubSignin: () => Promise<void>;
};

export type SignupProps = {
  emailSignup: (formData: EmailLoginFormData) => Promise<void>;
  googleSignup: () => Promise<void>;
  githubSignup: () => Promise<void>;
};
