import { Dispatch, SetStateAction } from "react";
import { Blog } from "./blog";
import { handleSendReplyParams } from "./reply";

export interface Comment {
  _id: string;
  commenterId: string;
  blogId: string;
  comment: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
  commenterName: string;
  buffer?: string | null;
  mimetype?: string | null;
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
