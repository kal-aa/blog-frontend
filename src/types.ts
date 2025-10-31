import { Dispatch, FormEvent, MutableRefObject, SetStateAction } from "react";

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

// BlogDetail.tsx
export interface BlogDetailProps {
  blog: Blog;
  editBodyValue: string;
  editBodyPen: boolean;
  expand: boolean;
  readyToUpdate: boolean;
  thumbsDown: boolean;
  thumbsUp: boolean;
  setEditBodyValue: (value: string) => void;
  setEditBodyPen: (value: boolean) => void;
  setThumbsDown: (value: boolean) => void;
  setThumbsUp: (value: boolean) => void;
  updateBtnRef: MutableRefObject<HTMLButtonElement | null>;
}

export interface Comment {
  _id: string;
  commenterId: string;
  blogId: string;
  comment: string;
  likes: string[];
  dislikes: string[];
  timeStamp: string;
  commenterName: string;
  buffer?: string | null;
  mimetype?: string | null;
}

// BlogDetailView.tsx
export interface BlogDetailViewProps {
  blog: Blog;
  optimComments: Comment[];
  expand: boolean;
  editBodyPen: boolean;
  readyToUpdate: boolean;
  isSendingComment: boolean;
  commentCount: number;
  dislikeCount: number;
  likeCount: number;
  commentValue: string;
  editBodyValue: string;
  handleSendComment: (e: FormEvent<HTMLFormElement>) => void;
  handleThumbsUpClick: () => void;
  handleThumbsDownClick: () => void;
  handleRegThumbsUpClick: () => void;
  handleRegThumbsDownClick: () => void;
  setShowComments: (value: boolean) => void;
  setEditBodyPen: (value: boolean) => void;
  showComments: boolean;
  thumbsDown: boolean;
  thumbsUp: boolean;
  setEditBodyValue: (value: string) => void;
  setCommentValue: (value: string) => void;
  setCommentCount: Dispatch<SetStateAction<number>>;
  setOptimComments: Dispatch<SetStateAction<Comment[]>>;
  commentRef: MutableRefObject<HTMLDivElement | null>;
  pTagRef: MutableRefObject<HTMLParagraphElement | null>;
  updateBtnRef: MutableRefObject<HTMLButtonElement | null>;
}

// CommentList.tsx
export interface CommentListProps {
  blog: Blog;
  optimComments: Comment[];
  setOptimComments: Dispatch<SetStateAction<Comment[]>>;
  setCommentCount: Dispatch<SetStateAction<number>>;
}

export interface handleUnlikeParams {
  optimComment: Comment;
  setThumbsUp: Dispatch<SetStateAction<boolean>>;
  setLikeCount: Dispatch<SetStateAction<number>>;
}

export interface handleLikeParams extends handleUnlikeParams {
  dislikeCount: number;
  thumbsDown: boolean;
  setDislikeCount: Dispatch<SetStateAction<number>>;
  setThumbsDown: Dispatch<SetStateAction<boolean>>;
}

export interface handleUndislikeParams {
  optimComment: Comment;
  setDislikeCount: Dispatch<SetStateAction<number>>;
  setThumbsDown: Dispatch<SetStateAction<boolean>>;
}

export interface handleDislikeParams extends handleUndislikeParams {
  likeCount: number;
  thumbsUp: boolean;
  setLikeCount: Dispatch<SetStateAction<number>>;
  setThumbsUp: Dispatch<SetStateAction<boolean>>;
}

export interface handleDeleteCommentParams {
  optimComment: Comment;
  setIsDeletingComment: (value: boolean) => void;
}

export interface handleSendReplyParams {
  e: FormEvent<HTMLFormElement>;
  optimComment: Comment;
  replyValue: string;
  setIsSendingReply: (value: boolean) => void;
  setOptimReplies: Dispatch<SetStateAction<Reply[]>>;
  setReplyCount: Dispatch<SetStateAction<number>>;
  setReplyValue: Dispatch<SetStateAction<string>>;
  setShowReplies: Dispatch<SetStateAction<boolean>>;
}

export interface Reply {
  _id: string;
  blogId: string;
  commentId: string;
  replierId: string;
  reply: string;
  timeStamp: string;
  replierName: string;
  buffer?: string | null;
  mimetype?: string | null;
}

// CommentCard.tsx
export interface CommentCardProps {
  optimComment: Comment;
  authorId: string;
  handleSendReply: (params: handleSendReplyParams) => void;
  handleDeleteComment: (params: handleDeleteCommentParams) => void;
  handleUndislike: (params: handleUndislikeParams) => void;
  handleUnlike: (params: handleUnlikeParams) => void;
  handleDislike: (params: handleDislikeParams) => void;
  handleLike: (params: handleLikeParams) => void;
}
