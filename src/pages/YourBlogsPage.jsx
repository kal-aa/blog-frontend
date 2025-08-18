import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchBlogs";
import { isObjectId } from "../utils/isObjectId";
import BlogFetchError from "../components/BlogFetchError";
import Pagination from "../components/Pagination";
import BlogCard from "../components/BlogCard";
import { useUser } from "../context/UserContext";
import { useDispatch } from "react-redux";
import { setIsHome } from "../features/blogSlice";
import { setGlobalError } from "../features/errorSlice";
import { toast } from "react-toastify";

const YourBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  // const [updateError, setUpdateError] = useState("");
  const [limit, setLimit] = useState(0);
  const queryclient = useQueryClient();
  const { user } = useUser();
  const id = user?.id;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsHome(false));
  }, [dispatch]);

  const { data, isFetching, isRefetching, isError, refetch } = useQuery({
    queryKey: ["your-blogs", { route: `your-blogs/${id}?page=${limit}` }],
    queryFn: fetchData,
    enabled: isObjectId(id),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const { blogs: paginatedBlogs = [], totalPages = 0 } = data || {};

  useEffect(() => {
    if (paginatedBlogs) {
      setBlogs(paginatedBlogs);
    }
  }, [paginatedBlogs]);

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

        queryclient.invalidateQueries(["all-blogs"]);
        queryclient.invalidateQueries(["your-blogs"]);

        toast.success("Blog deleted successfully!");
      } catch (error) {
        console.error("Error deleting blog", error);
        if (deleteCandidate) setBlogs((prev) => [...prev, deleteCandidate]);
      } finally {
        setIsDeleting(false);
      }
    },
    [blogs, id, queryclient]
  );

  // Update blog
  const handleUpdate = useCallback(
    async (
      blog,
      originalBodyRef,
      originalTitleRef,
      setEditBodyPen,
      setEditBodyValue,
      setEditTitlePen,
      setEditTitleValue,
      setIsUpdating
    ) => {
      const { editTitleValue: title, editBodyValue: body, _id: blogId } = blog;

      setIsUpdating(true);

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
          const message =
            err.mssg || "An unexpected error occured during update";
          dispatch(setGlobalError(message));

          // Reset to orginal values
          setEditBodyValue(originalBodyRef.current);
          setEditTitleValue(originalTitleRef.current);

          throw new Error(err.mssg || "An unexpected error occured");
        }

        toast.success("Blog updated successfully!");

        queryclient.invalidateQueries(["all-blogs"]);
        queryclient.invalidateQueries(["your-blogs"]);

        originalBodyRef.current = body;
        originalTitleRef.current = title;
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
    [blogs, id, queryclient, dispatch]
  );

  useEffect(() => {
    if (!isFetching && (isError || !isObjectId(id))) {
      dispatch(setGlobalError("Failed to fetch blogs."));
    }
  }, [dispatch, id, isError, isFetching]);

  if (isError || !isObjectId(id)) {
    return <BlogFetchError refetch={refetch} isError={isError} />;
  }

  return (
    <div>
      {/* Check the fetching status and give info accordingly */}
      {isFetching && !isRefetching ? (
        <div className="flex flex-col justify-center items-center text-blue-800 min-h-[50vh]">
          <RingLoader color="darkBlue" size={100} speedMultiplier={1.5} />
          <p>please wait...</p>
        </div>
      ) : (
        blogs.length === 0 && (
          <p className="text-xl text-center">
            Add your
            <NavLink
              to="/add-blog"
              className="mx-1 text-blue-800 underline underline-offset-2 hover:text-blue-700"
            >
              First
            </NavLink>
            One
          </p>
        )
      )}

      {/* send the data to the BlogCard component */}
      {blogs && blogs.length > 0 && (
        <div className="flex flex-col mx-[10%] sm:mx-[15%] md:mx-[20%] lg:mx-[25%] 2xl:mx-[30%] space-y-14 my-5">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              comments={blog.comments}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          ))}

          {/* Pagination */}
          <Pagination
            limit={limit}
            setLimit={setLimit}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default YourBlogsPage;
