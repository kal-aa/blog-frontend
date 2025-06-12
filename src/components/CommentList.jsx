import { useParams } from "react-router-dom";
import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import CommentCard from "./CommentCard";

function CommentList(data) {
  const {
    blog,
    optimComments,
    onInteractionUpdate,
    isHome,
    setCommentCount,
    setOptimComments,
    setUserOfInterest,
  } = data;
  const { id } = useParams();

  const urll = (optimComment) =>
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
          await axios.patch(urll(optimComment), {
            action: "removeCommentDislike",
            userId: id,
          });
        }

        //Add like
        await axios.patch(urll(optimComment), {
          action: "addCommentLike",
          userId: id,
        });

        const newDislikes = optimComment.dislikes.filter((d) => d !== id);
        const newLikes = [...optimComment.likes, id];
        onInteractionUpdate(optimComment._id, {
          likes: newLikes,
          dislikes: newDislikes,
        });
      } catch (error) {
        console.error("Error removing dislike and or adding like:", error);
        setThumbsUp(false);
        setLikeCount((prev) => prev - 1);
        setThumbsDown(prevThumbsDown);
        setDislikeCount(prevDislikeCount);
      }
    },
    [id, onInteractionUpdate]
  );

  //  setThumbsUp(false) remove like
  const handleThumbsupClick = useCallback(
    async (optimComment, setThumbsUp, setLikeCount) => {
      setThumbsUp(false);
      setLikeCount((prev) => prev - 1);

      try {
        await axios.patch(urll(optimComment), {
          action: "removeCommentLike",
          userId: id,
        });

        const newLikes = optimComment.likes.filter((l) => l !== id);
        onInteractionUpdate(optimComment._id, {
          likes: newLikes,
          dislikes: optimComment.dislikes,
        });
      } catch (error) {
        console.error("Error removing like:", error);
        setThumbsUp(true);
        setLikeCount((prev) => prev + 1);
      }
    },
    [id, onInteractionUpdate]
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
          await axios.patch(urll(optimComment), {
            action: "removeCommentLike",
            userId: id,
          });

        // add dislike
        await axios.patch(urll(optimComment), {
          action: "addCommentDislike",
          userId: id,
        });

        const newLikes = optimComment.likes.filter((l) => l !== id);
        const newDislikes = [...optimComment.dislikes, id];
        onInteractionUpdate(optimComment._id, {
          likes: newLikes,
          dislikes: newDislikes,
        });
      } catch (error) {
        console.log("Error adding dislike and or removing like:", error);
        setThumbsDown(false);
        setDislikeCount((prev) => prev - 1);
        setThumbsUp(prevThumbsUp);
        setLikeCount(prevLikeCount);
      }
    },
    [id, onInteractionUpdate]
  );

  //  setThumbsDown(false)  remove dislike
  const handleThumbsDownClick = useCallback(
    async (optimComment, setDislikeCount, setThumbsDown) => {
      setThumbsDown(false);
      setDislikeCount((prev) => prev - 1);

      try {
        await axios.patch(urll(optimComment), {
          action: "removeCommentDislike",
          userId: id,
        });

        const newDislikes = optimComment.dislikes.filter((l) => l !== id);
        onInteractionUpdate(optimComment._id, {
          likes: optimComment.likes,
          dislikes: newDislikes,
        });
      } catch (error) {
        console.error("Error removing dislike:", error);
        setThumbsDown(true);
        setDislikeCount((prev) => prev + 1);
      }
    },
    [id, onInteractionUpdate]
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
    [setCommentCount, setOptimComments]
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
        const res = await axios.patch(urll(optimComment), {
          action: "reply",
          userId: id,
          reply: replyValue,
        });

        const newReply = res.data.newReply;
        if (!newReply) throw new Error("Error receiving the new reply");

        // Replace temp reply with the real reply from server
        setOptimReplies((prev) =>
          prev.map((r) => (r._id === tempId ? newReply : r))
        );

        // Update parent state with new replies array
        onInteractionUpdate(optimComment._id, {
          replies: [...optimComment.replies, newReply].sort(
            (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
          ),
        });
      } catch (error) {
        console.error("Error comming", error);
        // Rollback optimisitc reply
        setOptimReplies((prev) => prev.filter((r) => r._id !== tempId));
        setReplyCount((prev) => prev - 1);
      } finally {
        setIsSendingReply(false);
      }
    },
    [id, onInteractionUpdate]
  );

  return (
    <>
      {optimComments.map((c) => (
        <CommentCard
          key={`${c._id}-${c.likes.length}-${c.dislikes.length}`}
          authorId={blog.authorId}
          handleDeleteComment={handleDeleteComment}
          handleRegThumbsDownClick={handleRegThumbsDownClick}
          handleRegThumbsUpClick={handleRegThumbsUpClick}
          handleSendReply={handleSendReply}
          handleThumbsDownClick={handleThumbsDownClick}
          handleThumbsupClick={handleThumbsupClick}
          isHome={isHome}
          onInteractionUpdate={onInteractionUpdate}
          optimComment={c}
          setOptimComments={setOptimComments}
          setUserOfInterest={setUserOfInterest}
        />
      ))}
    </>
  );
}

CommentList.propTypes = {
  blog: PropTypes.object.isRequired,
  optimComments: PropTypes.array.isRequired,
  onInteractionUpdate: PropTypes.func,
  isHome: PropTypes.bool,
  setCommentCount: PropTypes.func,
  setOptimComments: PropTypes.func,
  setUserOfInterest: PropTypes.func,
};

export default memo(CommentList);
