import { useNavigate, useParams } from "react-router-dom";
import AddBlog from "../components/AddBlog";

const AddBlogPage = () => {
  const { id } = useParams();
  const navigage = useNavigate();

  const postBlog = async (formData, setIsPosting, setError) => {
    const url = `https://blog-backend-sandy-three.vercel.app/add-blog/${id}`;

    setIsPosting(true);
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
      setIsPosting(false);
      navigage(`/your-blogs/${id}`);
    } catch (error) {
      setIsPosting(false);
      console.log("Error posting a blog", error.message);
    }
  };

  return <AddBlog postBlog={postBlog} />;
};

export default AddBlogPage;
