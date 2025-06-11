import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import BlogDetailView from "./BlogDetailView";

function BlogDetail(data) {
  const {
    blog,
    comments,
    editBodyPen,
    editBodyValue,
    expand,
    isHome,
    readyToUpdate,
    setEditBodyPen,
    setEditBodyValue,
    setThumbsDown,
    setThumbsUp,
    setUserOfInterest,
    thumbsDown,
    thumbsUp,
    updateBtnRef,
  } = data;
  const sortedComments = comments.sort(
    (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
  );
  const [optimComments, setOptimComments] = useState(sortedComments);
  const [showComments, setShowComments] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [likeCount, setLikeCount] = useState(blog.likes.length);
  const [dislikeCount, setDislikeCount] = useState(blog.dislikes.length);
  const [commentCount, setCommentCount] = useState(optimComments.length);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const commentRef = useRef(null);
  const pTagRef = useRef(null);
  const { id } = useParams();

  // Check if the click was outside the comments section and the p tag
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        commentRef.current &&
        !commentRef.current.contains(e.target) &&
        pTagRef.current &&
        !pTagRef.current.contains(e.target)
      ) {
        setShowComments(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowComments]);

  const url = `${
    import.meta.env.VITE_BACKEND_URL
  }/interaction/${encodeURIComponent(blog._id)}`;

  //  setThumbsUp(true) add like
  const handleRegThumbsUpClick = useCallback(async () => {
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
      if (thumbsDown) {
        // Remove dislkie
        await axios.patch(url, {
          action: "removeDislike",
          userId: id,
        });
      }

      // Add like
      await axios.patch(url, {
        action: "addLike",
        userId: id,
      });
    } catch (error) {
      console.error("Error updating like/dislike:", error);
      // Rollback optimistic updates
      setThumbsUp(false);
      setLikeCount((prev) => prev - 1);
      setThumbsDown(prevThumbsDown);
      setDislikeCount(prevDislikeCount);
    }
  }, [setThumbsDown, thumbsDown, setThumbsUp, dislikeCount, url, id]);

  //  setThumbsUp(false) remove like
  const handleThumbsupClick = useCallback(async () => {
    setThumbsUp(false);
    setLikeCount((prev) => prev - 1);

    try {
      await axios.patch(url, {
        action: "removeLike",
        userId: id,
      });
    } catch (error) {
      console.error("Error removing like:", error);
      // Rollback
      setThumbsUp(true);
      setLikeCount((prev) => prev + 1);
    }
  }, [setThumbsUp, url, id]);

  //  setThumbsDown(true) add dislike
  const handleRegThumbsDownClick = useCallback(async () => {
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
      if (thumbsUp) {
        await axios.patch(url, { action: "removeLike", userId: id });
      }
      await axios.patch(url, { action: "addDislike", userId: id });
    } catch (error) {
      console.error("Error removing like and or adding dislike:", error);
      // Rollback
      setThumbsDown(false);
      setDislikeCount((prev) => prev - 1);
      setThumbsUp(prevThumbsUp);
      setLikeCount(prevLikeCount);
    }
  }, [setThumbsDown, setThumbsUp, thumbsUp, url, likeCount, id]);

  //  setThumbsDown(false)  remove dislike
  const handleThumbsDownClick = useCallback(async () => {
    setThumbsDown(false);
    setDislikeCount((prev) => prev - 1);

    try {
      await axios.patch(url, {
        action: "removeDislike",
        userId: id,
      });
    } catch (error) {
      console.error("Error removing dislike:", error);
      // Rollback
      setThumbsDown(true);
      setDislikeCount((prev) => prev + 1);
    }
  }, [setThumbsDown, id, url]);

  // send comment
  const handleSendComment = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSendingComment(true);

      // Temporary optimisitc comment
      const tempId = new Date().getTime().toString();
      const tempComment = {
        _id: tempId,
        blogId: blog._id,
        commenterId: id,
        comment: commentValue,
        timeStamp: new Date().toISOString(),
        likes: [],
        dislikes: [],
        replies: [],
      };

      setOptimComments((prev) =>
        [...prev, tempComment].sort(
          (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
        )
      );
      setCommentCount((prev) => prev + 1);
      setCommentValue("");

      try {
        const res = await axios.patch(url, {
          action: "comment",
          userId: id,
          blogId: blog._id,
          comment: commentValue,
        });

        const newComment = res.data.newComment;
        if (!newComment) throw new Error("Error receiving the new comment");

        setOptimComments((prev) =>
          prev.map((c) => (c._id === tempId ? newComment : c))
        );
        setShowComments(true);
      } catch (error) {
        console.error("Error comming", error);
        // Rollback optimistic comment
        setOptimComments((prev) => prev.filter((c) => c._id !== tempId));
        setCommentCount((prev) => prev - 1);
      } finally {
        setIsSendingComment(false);
      }
    },
    [blog._id, id, commentValue, url]
  );

  const handleInteractionUpdate = useCallback((commentId, updates) => {
    setOptimComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, ...updates } : c))
    );
  }, []);

  return (
    <BlogDetailView
      blog={blog}
      commentCount={commentCount}
      commentRef={commentRef}
      commentValue={commentValue}
      dislikeCount={dislikeCount}
      editBodyPen={editBodyPen}
      editBodyValue={editBodyValue}
      expand={expand}
      handleRegThumbsUpClick={handleRegThumbsUpClick}
      handleRegThumbsDownClick={handleRegThumbsDownClick}
      handleSendComment={handleSendComment}
      handleThumbsDownClick={handleThumbsDownClick}
      handleThumbsupClick={handleThumbsupClick}
      isHome={isHome}
      isSendingComment={isSendingComment}
      likeCount={likeCount}
      onInteractionUpdate={handleInteractionUpdate}
      optimComments={optimComments}
      pTagRef={pTagRef}
      readyToUpdate={readyToUpdate}
      setCommentCount={setCommentCount}
      setCommentValue={setCommentValue}
      setEditBodyPen={setEditBodyPen}
      setEditBodyValue={setEditBodyValue}
      setOptimComments={setOptimComments}
      setShowComments={setShowComments}
      setUserOfInterest={setUserOfInterest}
      showComments={showComments}
      thumbsDown={thumbsDown}
      thumbsUp={thumbsUp}
      updateBtnRef={updateBtnRef}
    />
  );
}

BlogDetail.propTypes = {
  blog: PropTypes.object.isRequired,
  comments: PropTypes.array,
  editBodyPen: PropTypes.bool,
  editBodyValue: PropTypes.string,
  expand: PropTypes.bool,
  isHome: PropTypes.bool,
  readyToUpdate: PropTypes.bool,
  setEditBodyPen: PropTypes.func,
  setEditBodyValue: PropTypes.func,
  setThumbsDown: PropTypes.func,
  setThumbsUp: PropTypes.func,
  setUserOfInterest: PropTypes.func,
  thumbsDown: PropTypes.bool,
  thumbsUp: PropTypes.bool,
  updateBtnRef: PropTypes.object,
};

export default BlogDetail;
