import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchBlogs";
import { isObjectId } from "../utils/isObjectId";
import BlogDetailView from "./BlogDetailView";
import { useUser } from "../context/UserContext";
import { setGlobalError } from "../features/errorSlice";
import { useDispatch } from "react-redux";
import { Blog, BlogDetailProps, Comment } from "../types";
import { invalidateBlogQueries } from "../utils/InvalidateBlogQueries";

function BlogDetail({
  blog,
  editBodyPen,
  editBodyValue,
  expand,
  readyToUpdate,
  setEditBodyPen,
  setEditBodyValue,
  setThumbsDown,
  setThumbsUp,
  thumbsDown,
  thumbsUp,
  updateBtnRef,
}: BlogDetailProps) {
  const [optimComments, setOptimComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const pTagRef = useRef<HTMLParagraphElement>(null);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const id = user?.id;
  const dispatch = useDispatch();

  const {
    data: comments,
    isSuccess,
    // refetch,
  } = useQuery({
    queryKey: ["comments", { route: `blogs/${blog._id}/comments` }],
    queryFn: fetchData<Comment[]>,
    enabled: isObjectId(blog._id),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    setLikeCount(blog.likes.length);
    setDislikeCount(blog.dislikes.length);
  }, [blog.likes, blog.dislikes]);

  useEffect(() => {
    if (isSuccess) {
      setOptimComments(comments ?? []);
      setCommentCount(comments?.length ?? 0);
    }
  }, [comments, isSuccess]);

  // Check if the click was outside the comments section and the p tag
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !commentRef.current?.contains(e.target as Node) &&
        !pTagRef.current?.contains(e.target as Node)
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

      invalidateBlogQueries(queryClient);
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
  const handleThumbsUpClick = useCallback(async () => {
    setThumbsUp(false);
    setLikeCount((prev) => prev - 1);

    try {
      await axios.patch(url, {
        action: "removeLike",
        userId: id,
      });

      invalidateBlogQueries(queryClient);
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

      invalidateBlogQueries(queryClient);
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

      invalidateBlogQueries(queryClient);
    } catch (error) {
      console.error("Error removing dislike:", error);
      // Rollback
      setThumbsDown(true);
      setDislikeCount((prev) => prev + 1);
    }
  }, [setThumbsDown, id, url, queryClient]);

  // send comment
  const handleSendComment = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSendingComment(true);

      // Temporary optimisitc comment
      const tempId = Date.now().toString();
      const tempComment: Comment = {
        _id: tempId,
        blogId: blog._id,
        commenterId: id || "temp-id",
        comment: commentValue,
        timeStamp: new Date().toISOString(),
        likes: [],
        dislikes: [],
        commenterName: user?.name || "Unknown User",
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
          const message = err?.mssg || "Something wrong happened";
          dispatch(setGlobalError(message));
          setShowComments(false);
          throw new Error(err?.mssg || "Comment failed");
        }

        const { newComment } = await res.json();
        if (!newComment) throw new Error("No new comment returned");

        // Replace temp comment with real one directly in cache
        queryClient.setQueryData<Comment[]>(
          ["comments", { route: `blogs/${blog._id}/comments` }],
          (old) => {
            if (!old) return [newComment];
            return [newComment, ...old];
          }
        );

        invalidateBlogQueries(queryClient, ["your-blogs"]);
      } catch (error) {
        console.error("Error comming", error);
        // Rollback optimistic comment
        setOptimComments((prev) => prev.filter((c) => c._id !== tempId));
        setCommentCount((prev) => prev - 1);
      } finally {
        setIsSendingComment(false);
      }
    },
    [blog._id, id, commentValue, queryClient, dispatch]
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
      handleThumbsUpClick={handleThumbsUpClick}
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
      showComments={showComments}
      thumbsDown={thumbsDown}
      thumbsUp={thumbsUp}
      updateBtnRef={updateBtnRef}
    />
  );
}

export default BlogDetail;
