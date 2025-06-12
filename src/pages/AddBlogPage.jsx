import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateBlogForm from "../components/CreateBlogForm";

const AddBlogPage = () => {
  const { id } = useParams();
  const navigage = useNavigate();

  const hanldeBlogPost = useCallback(
    async (formData, setIsPosting, setError) => {
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
          setError(error.mssg);
          throw new Error(error.mssg);
        }

        setError("");
        navigage(`/your-blogs/${id}`);
      } catch (error) {
        console.error("Error posting a blog", error.message);
      } finally {
        setIsPosting(false);
      }
    },
    [id, navigage]
  );

  return <CreateBlogForm hanldeBlogPost={hanldeBlogPost} />;
};

export default AddBlogPage;
