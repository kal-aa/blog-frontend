import { memo, useCallback } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { setGlobalError } from "../features/errorSlice";
import { useDispatch } from "react-redux";
import {
  Comment,
  CommentListProps,
  handleDeleteCommentParams,
  handleDislikeParams,
  handleLikeParams,
  handleUndislikeParams,
  handleUnlikeParams,
} from "../types/comment";
import { handleSendReplyParams, Reply } from "../types/reply";
import { invalidateBlogQueries } from "../utils/InvalidateBlogQueries";
import { queryKeys } from "../utils/queryKeys";
import CommentCard from "./CommentCard";

function CommentList({
  blog,
  optimComments,
  setCommentCount,
  setOptimComments,
}: CommentListProps) {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const id = user?.id;
  const dispatch = useDispatch();

  const updateComment = async (optimComment_id: string, action: string) => {
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/interaction/${optimComment_id}`,
      {
        action,
        userId: id,
      },
    );
  };

  // setThumbsUp(true) Add like
  const handleLike = useCallback(
    async ({
      optimComment,
      dislikeCount,
      setDislikeCount,
      setLikeCount,
      setThumbsDown,
      setThumbsUp,
      thumbsDown,
    }: handleLikeParams) => {
      setThumbsUp(true);
      setLikeCount((prev: number) => prev + 1);

      // Save previous state for rollback
      const prevThumbsDown = thumbsDown;
      const prevDislikeCount = dislikeCount;
      if (thumbsDown) {
        setThumbsDown(false);
        setDislikeCount((prev) => prev - 1);
      }
      try {
        // Remove dislike first
        if (thumbsDown)
          await updateComment(optimComment._id, "removeCommentDislike");

        //Add like
        await updateComment(optimComment._id, "addCommentLike");
        queryClient.setQueryData<Comment[]>(
          queryKeys.comments(blog._id),

          (old) => {
            if (!old) return old;
            return old.map((c) => {
              if (c._id !== optimComment._id) return c;

              return {
                ...c,
                likes: id && !c.likes.includes(id) ? [...c.likes, id] : c.likes,
                dislikes: c.dislikes.filter((d) => d !== id),
              };
            });
          },
        );
      } catch (error) {
        console.error("Error removing dislike and or adding like:", error);
        setThumbsUp(false);
        setLikeCount((prev) => prev - 1);
        setThumbsDown(prevThumbsDown);
        setDislikeCount(prevDislikeCount);
      }
    },
    [id, queryClient, blog._id],
  );

  //  setThumbsUp(false) remove like
  const handleUnlike = useCallback(
    async ({ optimComment, setThumbsUp, setLikeCount }: handleUnlikeParams) => {
      setThumbsUp(false);
      setLikeCount((prev) => prev - 1);

      try {
        await updateComment(optimComment._id, "removeCommentLike");
        queryClient.setQueryData<Comment[]>(
          queryKeys.comments(blog._id),
          (old) => {
            if (!old) return old;
            return old.map((c) => {
              if (c._id !== optimComment._id) return c;

              return {
                ...c,
                likes: c.likes.filter((l) => l !== id),
              };
            });
          },
        );
      } catch (error) {
        console.error("Error removing like:", error);
        setThumbsUp(true);
        setLikeCount((prev) => prev + 1);
      }
    },
    [id, queryClient, blog._id],
  );

  //  setThumbsDown(true) add dislike
  const handleDislike = useCallback(
    async ({
      likeCount,
      optimComment,
      setDislikeCount,
      setLikeCount,
      setThumbsUp,
      setThumbsDown,
      thumbsUp,
    }: handleDislikeParams) => {
      setThumbsDown(true);
      setDislikeCount((prev) => prev + 1);

      // Save previous state for rollback
      const prevThumbsUp = thumbsUp;
      const prevLikeCount = likeCount;
      if (thumbsUp) {
        setThumbsUp(false);
        setLikeCount((prev) => prev - 1);
      }

      try {
        // remove like first
        if (thumbsUp)
          await updateComment(optimComment._id, "removeCommentLike");

        // add dislike
        await updateComment(optimComment._id, "addCommentDislike");
        queryClient.setQueryData<Comment[]>(
          queryKeys.comments(blog._id),
          (old) => {
            if (!old) return old;
            return old.map((c) => {
              if (c._id !== optimComment._id) return c;

              return {
                ...c,
                likes: c.likes.filter((l) => l !== id),
                dislikes:
                  id && !c.dislikes.includes(id)
                    ? [...c.dislikes, id]
                    : c.dislikes,
              };
            });
          },
        );
      } catch (error) {
        console.log("Error adding dislike and or removing like:", error);
        setThumbsDown(false);
        setDislikeCount((prev) => prev - 1);
        setThumbsUp(prevThumbsUp);
        setLikeCount(prevLikeCount);
      }
    },
    [id, queryClient, blog._id],
  );

  //  setThumbsDown(false)  remove dislike
  const handleUndislike = useCallback(
    async ({
      optimComment,
      setDislikeCount,
      setThumbsDown,
    }: handleUndislikeParams) => {
      setThumbsDown(false);
      setDislikeCount((prev) => prev - 1);

      try {
        await updateComment(optimComment._id, "removeCommentDislike");
        queryClient.setQueryData<Comment[]>(
          queryKeys.comments(blog._id),
          (old) => {
            if (!old) return old;
            return old.map((c) => {
              if (c._id !== optimComment._id) return c;

              return {
                ...c,
                dislikes: c.dislikes.filter((d) => d !== id),
              };
            });
          },
        );
      } catch (error) {
        console.error("Error removing dislike:", error);
        setThumbsDown(true);
        setDislikeCount((prev) => prev + 1);
      }
    },
    [id, queryClient, blog._id],
  );

  // !isHome
  const handleDeleteComment = useCallback(
    async ({
      optimComment,
      setIsDeletingComment,
    }: handleDeleteCommentParams) => {
      setIsDeletingComment(true);

      setOptimComments((prev) =>
        prev.filter((c) => c._id !== optimComment._id),
      );
      setCommentCount((prev) => prev - 1);

      const delUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/delete-comment/${encodeURIComponent(optimComment._id)}`;

      try {
        await axios.delete(delUrl);
        queryClient.setQueryData<Comment[]>(
          queryKeys.comments(blog._id),
          (old) => {
            if (!old) return old;
            return old.filter((c) => c._id !== optimComment._id);
          },
        );
      } catch (error) {
        console.error("Error deleting comment", error);
        // Rollback
        if (optimComment) {
          setOptimComments((prev) =>
            [...prev, optimComment].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            ),
          );
          setCommentCount((prev) => prev + 1);
        }
      } finally {
        setIsDeletingComment(false);
      }
    },
    [setCommentCount, setOptimComments, queryClient, blog._id],
  );

  const handleSendReply = useCallback(
    async ({
      e,
      optimComment,
      replyValue,
      setIsSendingReply,
      setOptimReplies,
      setReplyCount,
      setReplyValue,
      setShowReplies,
    }: handleSendReplyParams) => {
      e.preventDefault();
      if (!replyValue.trim()) {
        setIsSendingReply(false);
        setReplyValue("");
        return;
      }

      setIsSendingReply(true);

      // Temporary optimisitc comment
      const tempId = new Date().getTime().toString();
      const tempReply: Reply = {
        _id: tempId,
        blogId: blog._id,
        commentId: optimComment._id,
        replierId: id || "temp-id",
        reply: replyValue,
        createdAt: new Date().toISOString(),
        replierName: user?.name || "Unknown User",
      };

      setOptimReplies((prev) =>
        [...prev, tempReply].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
      setReplyCount((prev) => prev + 1);
      setShowReplies(true);

      try {
        const replyData = {
          blogId: blog._id,
          commentId: optimComment._id,
          reply: replyValue,
        };

        const url = `${import.meta.env.VITE_BACKEND_URL}/add-reply/${id}`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(replyData),
        });

        if (!res.ok) {
          const err = await res.json();
          const message = err?.mssg || "Something wrong happened";
          dispatch(setGlobalError(message));
          throw new Error(err?.mssg || "Reply failed");
        }

        const { newReply } = await res.json();
        if (!newReply) throw new Error("No new reply returned");

        setOptimReplies((prev) =>
          prev.map((r) => (r._id === tempId ? newReply : r)),
        );

        queryClient.setQueryData<Reply[]>(
          queryKeys.replies(optimComment._id),
          (old) => {
            if (!old) return [newReply];
            return [newReply, ...(old?.filter((r) => r._id !== tempId) || [])];
          },
        );

        invalidateBlogQueries(queryClient);
      } catch (error) {
        console.error("Error sending reply", error);
        // Rollback optimisitc reply
        setOptimReplies((prev) => prev.filter((r) => r._id !== tempId));
        setReplyCount((prev) => prev - 1);
      } finally {
        setIsSendingReply(false);
        setReplyValue("");
      }
    },
    [id, queryClient, blog._id, dispatch, user?.name],
  );

  return (
    <>
      {optimComments.map((c) => (
        <CommentCard
          key={`${c._id}`}
          optimComment={c}
          authorId={blog.authorId}
          handleDeleteComment={handleDeleteComment}
          handleSendReply={handleSendReply}
          handleUndislike={handleUndislike}
          handleUnlike={handleUnlike}
          handleDislike={handleDislike}
          handleLike={handleLike}
        />
      ))}
    </>
  );
}

export default memo(CommentList);
