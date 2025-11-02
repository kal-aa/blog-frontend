import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import CreateBlogForm from "../components/CreateBlogForm";
import { useUser } from "../context/UserContext";
import { useDispatch } from "react-redux";
import { setGlobalError } from "../features/errorSlice";
import { toast } from "react-toastify";
import { invalidateBlogQueries } from "../utils/InvalidateBlogQueries";
import { BlogPostParams } from "../types/blog";

const AddBlogPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const id = user?.id;

  const dispatch = useDispatch();

  const handleBlogPost = useCallback(
    async ({ formData, setIsPosting }: BlogPostParams) => {
      setIsPosting(true);

      const url = `${import.meta.env.VITE_BACKEND_URL}/add-blog/${id}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const error = await res.json();
          dispatch(setGlobalError(error.mssg));
          return;
        }

        toast.success("Blog posted successfully!");

        invalidateBlogQueries(queryClient);
        navigate(`/your-blogs`);
      } catch (error: any) {
        console.error("Error posting a blog", error.message);
        dispatch(
          setGlobalError("Something went wrong while posting your blog.")
        );
      } finally {
        setIsPosting(false);
      }
    },
    [id, navigate, queryClient, dispatch]
  );

  return <CreateBlogForm handleBlogPost={handleBlogPost} />;
};

export default AddBlogPage;
