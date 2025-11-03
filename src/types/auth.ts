import {
  Dispatch,
  FormEvent,
  MouseEvent,
  RefObject,
  SetStateAction,
} from "react";

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

export type AuthLoaderProps = {
  active: boolean;
  color?: string;
  size?: number;
};

export type ProvidersData = {
  name: "google" | "github";
  icon: JSX.Element;
  method: () => Promise<void>;
};

// AccountPage.tsx
export interface UserData {
  _id: string;
  uid: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  buffer?: string;
  mimetype?: string;
  image?: string | null;
  removeImage?: boolean;
}

export interface ManageSubmitParams {
  e?: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>;
  fullNameRef: RefObject<HTMLElement>;
  setIsUpdating: Dispatch<SetStateAction<boolean>>;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  actionType: "update" | "delete";
}

export interface AccountFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  image: string | File | null;
  removeImage: boolean;
}

// ManageAccount.tsx
export interface ManageAccountProps {
  formData: AccountFormData;
  handleManageSubmit: (params: ManageSubmitParams) => void;
  isAuthenticating: boolean;
  manageError: string;
  providerId: string | null;
  setFormData: Dispatch<SetStateAction<AccountFormData>>;
}
