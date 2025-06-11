import { useCallback, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";
import ConnectionMonitor from "../components/ConnectionMonitor";
import BlogCard from "../components/BlogCard";

const YourBlogsPage = () => {
  const [isFetchingBlogs, setIsFetchingBlogs] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [updateError, setUpdateError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { id } = useParams();

  //  fetch blogs(your blogs)
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsFetchingBlogs(true);

      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/your-blogs/${id}`;
        const res = await fetch(url);

        const blogsArray = await res.json();
        setBlogs(blogsArray);
      } catch (error) {
        console.log("Error fetching blogs for your blogs page", error);
      } finally {
        setIsFetchingBlogs(false);
      }
    };
    fetchBlogs();
  }, [id]);

  // Delete blog
  const handleDelete = useCallback(
    async (blogId, setIsDeleting) => {
      const confirm = window.confirm(
        "Are you sure you want to delete this blog?"
      );
      if (!confirm) return;

      setIsDeleting(true);

      const deleteCandidate = blogs.find((b) => b._id === blogId);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));

      try {
        const url = `${
          import.meta.env.VITE_BACKEND_URL
        }/delete-blog/${encodeURIComponent(id)}?blogId=${encodeURIComponent(
          blogId
        )}`;
        await fetch(url, { method: "DELETE" });
      } catch (error) {
        console.error("Error deleting blog", error);
        if (deleteCandidate) setBlogs((prev) => [...prev, deleteCandidate]);
      } finally {
        setIsDeleting(false);
      }
    },
    [blogs, id]
  );

  // Update blog
  const handleUpdate = useCallback(
    async (blog, setEditBodyPen, setEditTitlePen, setIsUpdating) => {
      const { editTitleValue: title, editBodyValue: body, _id: blogId } = blog;

      setIsUpdating(true);
      setUpdateError("");

      const updateCandidate = blogs.find((b) => b._id === blog._id);
      setBlogs((prev) =>
        prev.map((b) => (b._id === blog._id ? { ...b, title, body } : b))
      );

      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/patch-blog/${encodeURIComponent(id)}`;
      try {
        const res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, body, blogId }),
        });

        if (!res.ok) {
          const err = await res.json();
          setUpdateError(err.mssg || "An unexpected error occured");
          throw new Error(err.mssg || "An unexpected error occured");
        }
      } catch (error) {
        console.error("Error updating blog", error);
        if (updateCandidate) {
          setBlogs((prev) =>
            prev.map((b) => (b._id === blogId ? updateCandidate : b))
          );
        }
      } finally {
        setIsUpdating(false);
        setEditTitlePen(false);
        setEditBodyPen(false);
      }
    },
    [blogs, id]
  );

  return (
    <div>
      <ConnectionMonitor isOnline={isOnline} setIsOnline={setIsOnline} />

      {/* Check the fetching status and give info accordingly */}
      {isOnline && isFetchingBlogs ? (
        <div className="flex flex-col justify-center items-center text-blue-800 min-h-[50vh]">
          <RingLoader color="darkBlue" size={100} speedMultiplier={1.5} />
          <p>please wait...</p>
        </div>
      ) : (
        isOnline &&
        blogs.length === 0 && (
          <p className="text-xl text-center">
            Add your
            <NavLink
              to={`/add-blog/${id}`}
              className="mx-1 text-blue-800 underline underline-offset-2 hover:text-blue-700"
            >
              First
            </NavLink>
            One
          </p>
        )
      )}

      {/* send the data to the BlogCard component */}
      <div className="flex flex-col mx-[10%] sm:mx-[15%] md:mx-[20%] lg:mx-[25%] 2xl:mx-[30%] space-y-14 my-5">
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              comments={blog.comments}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
              updateError={updateError}
            />
          ))}
      </div>
    </div>
  );
};

export default YourBlogsPage;
