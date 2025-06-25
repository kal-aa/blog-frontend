import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchBlogs";
import { isObjectId } from "../utils/isObjectId";
import BlogDetailView from "./BlogDetailView";

function BlogDetail(data) {
  const {
    blog,
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
  const [optimComments, setOptimComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const commentRef = useRef(null);
  const pTagRef = useRef(null);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isSuccess,
    // refetch,
  } = useQuery({
    queryKey: ["comments", { route: `blogs/${blog._id}/comments` }],
    queryFn: fetchData,
    enabled: isObjectId(blog._id),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  useEffect(() => {
    setLikeCount(blog.likes.length);
    setDislikeCount(blog.dislikes.length);
  }, [blog.likes, blog.dislikes]);

  useEffect(() => {
    if (isSuccess) {
      setOptimComments(comments);
      setCommentCount(comments.length || 0);
    }
  }, [comments, isSuccess]);

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

      queryClient.invalidateQueries(["all-blogs"]);
      queryClient.invalidateQueries(["your-blogs"]);
    } catch (error) {
      console.error("Error updating like/dislike:", error);
      // Rollback optimistic updates
      setThumbsUp(false);
      setLikeCount((prev) => prev - 1);
      setThumbsDown(prevThumbsDown);
      setDislikeCount(prevDislikeCount);
    }
  }, [
    setThumbsDown,
    thumbsDown,
    setThumbsUp,
    dislikeCount,
    url,
    id,
    queryClient,
  ]);

  //  setThumbsUp(false) remove like
  const handleThumbsupClick = useCallback(async () => {
    setThumbsUp(false);
    setLikeCount((prev) => prev - 1);

    try {
      await axios.patch(url, {
        action: "removeLike",
        userId: id,
      });

      queryClient.invalidateQueries(["all-blogs"]);
      queryClient.invalidateQueries(["your-blogs"]);
    } catch (error) {
      console.error("Error removing like:", error);
      // Rollback
      setThumbsUp(true);
      setLikeCount((prev) => prev + 1);
    }
  }, [setThumbsUp, url, id, queryClient]);

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

      queryClient.invalidateQueries(["all-blogs"]);
      queryClient.invalidateQueries(["your-blogs"]);
    } catch (error) {
      console.error("Error removing like and or adding dislike:", error);
      // Rollback
      setThumbsDown(false);
      setDislikeCount((prev) => prev - 1);
      setThumbsUp(prevThumbsUp);
      setLikeCount(prevLikeCount);
    }
  }, [setThumbsDown, setThumbsUp, thumbsUp, url, likeCount, id, queryClient]);

  //  setThumbsDown(false)  remove dislike
  const handleThumbsDownClick = useCallback(async () => {
    setThumbsDown(false);
    setDislikeCount((prev) => prev - 1);

    try {
      await axios.patch(url, {
        action: "removeDislike",
        userId: id,
      });

      queryClient.invalidateQueries(["all-blogs"]);
      queryClient.invalidateQueries(["your-blogs"]);
    } catch (error) {
      console.error("Error removing dislike:", error);
      // Rollback
      setThumbsDown(true);
      setDislikeCount((prev) => prev + 1);
    }
  }, [setThumbsDown, id, url, queryClient]);

  // send comment
  const handleSendComment = useCallback(
    async (e, setCommentError) => {
      e.preventDefault();
      setIsSendingComment(true);
      setCommentError("");

      // Temporary optimisitc comment
      const tempId = Date.now().toString();
      const tempComment = {
        _id: tempId,
        blogId: blog._id,
        commenterId: id,
        comment: commentValue,
        timeStamp: new Date().toISOString(),
        likes: [],
        dislikes: [],
      };

      setOptimComments((prev) => [tempComment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentValue("");
      setShowComments(true);

      try {
        const commentData = {
          blogId: blog._id,
          comment: commentValue,
        };

        const url = `${import.meta.env.VITE_BACKEND_URL}/add-comment/${id}`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        });

        if (!res.ok) {
          const err = await res.json();
          setCommentError(err?.mssg || "Something wrong happened");
          setShowComments(false);
          throw new Error(err?.mssg || "Comment failed");
        }

        const { newComment } = await res.json();
        if (!newComment) throw new Error("No new comment returned");

        // Replace temp comment with real one directly in cache
        queryClient.setQueryData(
          ["comments", { route: `blogs/${blog._id}/comments` }],
          (old) => {
            if (!old) return [newComment];
            return [newComment, ...old];
          }
        );

        queryClient.invalidateQueries(["your-blogs"]);
      } catch (error) {
        console.error("Error comming", error);
        // Rollback optimistic comment
        setOptimComments((prev) => prev.filter((c) => c._id !== tempId));
        setCommentCount((prev) => prev - 1);
      } finally {
        setIsSendingComment(false);
      }
    },
    [blog._id, id, commentValue, queryClient]
  );

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
