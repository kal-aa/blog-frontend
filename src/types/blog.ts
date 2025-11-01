import { Dispatch, FormEvent, MutableRefObject, SetStateAction } from "react";
import { Comment } from "./comment";

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
  author?: string;
  buffer?: string | null;
  mimetype?: string | null;
}

export interface BlogsResponse {
  blogsWithAuthors: Blog[];
  totalPages: number;
}

// YourBlogsPage.tsx
export interface YourBlogsResponse {
  blogs: Blog[];
  totalPages: number;
}

export interface DeleteBlogParams {
  blogId: string;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
}

// BlogCard.tsx
export interface UpdateBlogParams {
  blog: Blog;
  editTitleValue: string;
  editBodyValue: string;
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
  handleDeleteBlog?: (params: DeleteBlogParams) => void;
  handleUpdateBlog?: (params: UpdateBlogParams) => void;
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
