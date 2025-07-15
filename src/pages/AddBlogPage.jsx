import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import CreateBlogForm from "../components/CreateBlogForm";
import { useUser } from "../context/UserContext";

const AddBlogPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const id = user?.id;

  const hanldeBlogPost = useCallback(
    async (formData, setIsPosting, setError) => {
      setIsPosting(true);
      setError("");

      const url = `${import.meta.env.VITE_BACKEND_URL}/add-blog/${id}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const error = await res.json();
          setError(error.mssg);
          throw new Error(error.mssg);
        }

        queryClient.invalidateQueries(["your-blogs"]);
        queryClient.invalidateQueries(["all-blogs"]);
        navigate(`/your-blogs`);
      } catch (error) {
        console.error("Error posting a blog", error.message);
      } finally {
        setIsPosting(false);
      }
    },
    [id, navigate, queryClient]
  );

  return <CreateBlogForm hanldeBlogPost={hanldeBlogPost} />;
};

export default AddBlogPage;
