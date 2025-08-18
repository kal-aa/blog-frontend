import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import CommentCard from "./CommentCard";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { setGlobalError } from "../features/errorSlice";
import { useDispatch } from "react-redux";

function CommentList(data) {
  const { blog, optimComments, setCommentCount, setOptimComments } = data;
  const queryClient = useQueryClient();
  const { user } = useUser();
  const id = user?.id;

  const dispatch = useDispatch();

  const url = (optimComment) =>
    `${import.meta.env.VITE_BACKEND_URL}/interaction/${optimComment._id}`;

  // setThumbsUp(true) Add like
  const handleRegThumbsUpClick = useCallback(
    async (
      dislikeCount,
      optimComment,
      setDislikeCount,
      setLikeCount,
      setThumbsDown,
      setThumbsUp,
      thumbsDown
    ) => {
      setThumbsUp(true);
      setLikeCount((prev) => prev + 1);

      // Save previous state for rollback
      const prevThumbsDown = thumbsDown;
      const prevDislikeCount = dislikeCount;
      if (thumbsDown) {
        setThumbsDown(false);
        setDislikeCount((prev) => prev - 1);
      }
      try {
        // Remove dislike first
        if (thumbsDown) {
          await axios.patch(url(optimComment), {
            action: "removeCommentDislike",
            userId: id,
          });
        }

        //Add like
        await axios.patch(url(optimComment), {
          action: "addCommentLike",
          userId: id,
        });

        queryClient.setQueryData(
          ["comments", { route: `blogs/${blog._id}/comments` }],
          (old) => {
            if (!old) return old;
            return old.map((c) =>
              c._id === optimComment._id
                ? {
                    ...c,
                    likes: c.likes.includes(id) ? c.likes : [...c.likes, id],
                    dislikes: c.dislikes.filter((d) => d !== id),
                  }
                : c
            );
          }
        );
      } catch (error) {
        console.error("Error removing dislike and or adding like:", error);
        setThumbsUp(false);
        setLikeCount((prev) => prev - 1);
        setThumbsDown(prevThumbsDown);
        setDislikeCount(prevDislikeCount);
      }
    },
    [id, queryClient, blog._id]
  );

  //  setThumbsUp(false) remove like
  const handleThumbsupClick = useCallback(
    async (optimComment, setThumbsUp, setLikeCount) => {
      setThumbsUp(false);
      setLikeCount((prev) => prev - 1);

      try {
        await axios.patch(url(optimComment), {
          action: "removeCommentLike",
          userId: id,
        });

        queryClient.setQueryData(
          ["comments", { route: `blogs/${blog._id}/comments` }],
          (old) => {
            if (!old) return old;
            return old.map((c) =>
              c._id === optimComment._id
                ? {
                    ...c,
                    likes: c.likes.filter((l) => l !== id),
                  }
                : c
            );
          }
        );
      } catch (error) {
        console.error("Error removing like:", error);
        setThumbsUp(true);
        setLikeCount((prev) => prev + 1);
      }
    },
    [id, queryClient, blog._id]
  );

  //  setThumbsDown(true) add dislike
  const handleRegThumbsDownClick = useCallback(
    async (
      likeCount,
      optimComment,
      setDislikeCount,
      setLikeCount,
      setThumbsUp,
      setThumbsDown,
      thumbsUp
    ) => {
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
          await axios.patch(url(optimComment), {
            action: "removeCommentLike",
            userId: id,
          });

        // add dislike
        await axios.patch(url(optimComment), {
          action: "addCommentDislike",
          userId: id,
        });

        queryClient.setQueryData(
          ["comments", { route: `blogs/${blog._id}/comments` }],
          (old) => {
            if (!old) return old;
            return old.map((c) =>
              c._id === optimComment._id
                ? {
                    ...c,
                    likes: c.likes.filter((l) => l !== id),
                    dislikes: c.dislikes.includes(id)
                      ? c.dislikes
                      : [...c.dislikes, id],
                  }
                : c
            );
          }
        );
      } catch (error) {
        console.log("Error adding dislike and or removing like:", error);
        setThumbsDown(false);
        setDislikeCount((prev) => prev - 1);
        setThumbsUp(prevThumbsUp);
        setLikeCount(prevLikeCount);
      }
    },
    [id, queryClient, blog._id]
  );

  //  setThumbsDown(false)  remove dislike
  const handleThumbsDownClick = useCallback(
    async (optimComment, setDislikeCount, setThumbsDown) => {
      setThumbsDown(false);
      setDislikeCount((prev) => prev - 1);

      try {
        await axios.patch(url(optimComment), {
          action: "removeCommentDislike",
          userId: id,
        });

        queryClient.setQueryData(
          ["comments", { route: `blogs/${blog._id}/comments` }],
          (old) => {
            if (!old) return old;
            return old.map((c) =>
              c._id === optimComment._id
                ? {
                    ...c,
                    dislikes: c.dislikes.filter((d) => d !== id),
                  }
                : c
            );
          }
        );
      } catch (error) {
        console.error("Error removing dislike:", error);
        setThumbsDown(true);
        setDislikeCount((prev) => prev + 1);
      }
    },
    [id, queryClient, blog._id]
  );

  // !isHome
  const handleDeleteComment = useCallback(
    async (optimComment, setIsDeletingComment) => {
      setIsDeletingComment(true);

      setOptimComments((prev) =>
        prev.filter((c) => c._id !== optimComment._id)
      );
      setCommentCount((prev) => prev - 1);

      const delUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/delete-comment/${encodeURIComponent(optimComment._id)}`;

      try {
        await axios.delete(delUrl);
        queryClient.setQueryData(
          ["comments", { route: `blogs/${blog._id}/comments` }],
          (old) => {
            if (!old) return old;
            return old.filter((c) => c._id !== optimComment._id);
          }
        );
      } catch (error) {
        console.error("Error deleting comment", error);
        // Rollback
        if (optimComment) {
          setOptimComments((prev) =>
            [...prev, optimComment].sort(
              (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
            )
          );
          setCommentCount((prev) => prev + 1);
        }
      } finally {
        setIsDeletingComment(false);
      }
    },
    [setCommentCount, setOptimComments, queryClient, blog._id]
  );

  const handleSendReply = useCallback(
    async (
      e,
      optimComment,
      replyValue,
      setIsSendingReply,
      setOptimReplies,
      setReplyCount,
      setReplyValue,
      setShowReplies
    ) => {
      e.preventDefault();
      setIsSendingReply(true);

      // Temporary optimisitc comment
      const tempId = new Date().getTime().toString();
      const tempReply = {
        _id: tempId,
        replierId: id,
        reply: replyValue,
        timeStamp: new Date().toISOString(),
      };

      setOptimReplies((prev) =>
        [...prev, tempReply].sort(
          (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
        )
      );

      setReplyCount((prev) => prev + 1);
      setReplyValue("");
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

        queryClient.setQueryData(
          ["replies", { route: `comments/${optimComment._id}/replies` }],
          (old) => {
            if (!old) return [newReply];
            return [newReply, ...old];
          }
        );
      } catch (error) {
        console.error("Error comming", error);
        // Rollback optimisitc reply
        setOptimReplies((prev) => prev.filter((r) => r._id !== tempId));
        setReplyCount((prev) => prev - 1);
      } finally {
        setIsSendingReply(false);
      }
    },
    [id, queryClient, blog._id, dispatch]
  );

  return (
    <>
      {optimComments.map((c) => (
        <CommentCard
          key={`${c._id}`}
          authorId={blog.authorId}
          handleDeleteComment={handleDeleteComment}
          handleRegThumbsDownClick={handleRegThumbsDownClick}
          handleRegThumbsUpClick={handleRegThumbsUpClick}
          handleSendReply={handleSendReply}
          handleThumbsDownClick={handleThumbsDownClick}
          handleThumbsupClick={handleThumbsupClick}
          optimComment={c}
        />
      ))}
    </>
  );
}

CommentList.propTypes = {
  blog: PropTypes.object.isRequired,
  optimComments: PropTypes.array.isRequired,
  setCommentCount: PropTypes.func,
  setOptimComments: PropTypes.func,
};

export default memo(CommentList);
