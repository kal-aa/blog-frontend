import { MutableRefObject } from "react";

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

// BlogFetchError.tsx
export interface BlogFetchErrorProps {
  refetch: () => void;
  isError: boolean;
}

// blogSlice.ts
export interface BlogState {
  userOfInterest: string;
  isHome: boolean;
}

// Pagination.tsx
export interface PaginationProps {
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
}

// HomePage.tsx
export interface Blog {
  _id: string;
  title: string;
  body: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  dislikes: string[];
  views: string[];
  author: string;
  buffer?: string | null;
  mimetype?: string | null;
}

export interface BlogsResponse {
  blogsWithAuthors: Blog[];
  totalPages: number;
}

// BlogCard.tsx
export interface handleUpdateParams {
  blog: Blog;
  originalBodyRef: MutableRefObject<string>;
  originalTitleRef: MutableRefObject<string>;
  setEditTitlePen: (value: boolean) => void;
  setEditBodyPen: (value: boolean) => void;
  setEditTitleValue: (value: string) => void;
  setEditBodyValue: (value: string) => void;
  setIsUpdating: (value: boolean) => void;
}

export interface BlogCardProps {
  blog: Blog;
  handleDelete?: (
    blogId: string,
    setIsDeleting: (value: boolean) => void
  ) => void;
  handleUpdate?: (params: handleUpdateParams) => void;
}
