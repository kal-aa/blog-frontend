import { Dispatch, FormEvent, SetStateAction } from "react";
import { Comment } from "./comment";

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
  createdAt: string;
  replierName: string;
  buffer?: string | null;
  mimetype?: string | null;
}

// ReplyList.tsx
export interface ReplyListProps {
  authorId: string;
  optimComment: Comment;
  optimReplies: Reply[];
  setOptimReplies: Dispatch<SetStateAction<Reply[]>>;
  setReplyCount: Dispatch<SetStateAction<number>>;
}

export interface handleDeleteReplyParams {
  optimReply: Reply;
  setIsDeletingReply: Dispatch<SetStateAction<boolean>>;
}

// ReplyCard.tsx
export interface ReplyCardProps {
  authorId: string;
  handleDeleteReply: (params: handleDeleteReplyParams) => void;
  optimReply: Reply;
}
