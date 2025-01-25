import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";
import Main from "../components/Main";
import IsOnline from "../components/IsOnline";

const YourBlogsPage = () => {
  const [trigger, setTrigger] = useState(false);
  const [isFetchingBlogs, setIsFetchingBlogs] = useState(true);
  const [data, setData] = useState([]);
  const [updateError, setUpdateError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { id } = useParams();

  //  fetch blogs(your blogs)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsFetchingBlogs(true);
        const url = `https://blog-backend-sandy-three.vercel.app/your-blogs/${id}`;

        const res = await fetch(url);
        const dataArray = await res.json();

        setIsFetchingBlogs(false);
        setData(dataArray);
      } catch (error) {
        setIsFetchingBlogs(false);
        console.log("Error fetching blogs", error);
      }
    };
    isOnline && fetchBlogs();
  }, [id, trigger, isOnline]);

  // Delete
  const handleDelete = async (blogId, setIsDeleting) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirm) {
      try {
        const url = `https://blog-backend-sandy-three.vercel.app/delete-blog/${encodeURIComponent(
          id
        )}?blogId=${encodeURIComponent(blogId)}`;
        setIsDeleting(true);
        await fetch(url, { method: "DELETE" });

        setIsDeleting(false);
        setTrigger((prev) => !prev);
      } catch (error) {
        setIsDeleting(false);
        console.error("Error deleting blog", error);
      }
    }
  };

  // Update
  const handleUpdate = async (
    blog,
    setEditTitlePen,
    setEditBodyPen,
    setIsUpdating
  ) => {
    const updateData = {
      blogId: blog._id,
      title: blog.editTitleValue,
      body: blog.editBodyValue,
    };
    try {
      const url = `https://blog-backend-sandy-three.vercel.app/patch-blog/${encodeURIComponent(
        id
      )}`;
      setIsUpdating(true);
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const err = await res.json();
        setUpdateError(err.mssg || "An unexpected error occured");
        throw new Error(err.mssg || "An unexpected error occured");
      }

      setIsUpdating(false);
      setUpdateError("");
      setTrigger((prev) => !prev);
      setEditTitlePen(false);
      setEditBodyPen(false);
    } catch (error) {
      setIsUpdating(false);
      console.error("Error updating blog", error);
    }
  };

  return (
    <div>
      <IsOnline isOnline={isOnline} setIsOnline={setIsOnline} />

      {/* Check the fetching status and give info accordingly */}
      {isOnline && isFetchingBlogs ? (
        <div className="flex flex-col justify-center items-center text-blue-800 min-h-[50vh]">
          <RingLoader color="darkBlue" size={100} speedMultiplier={1.5} />
          <p>please wait...</p>
        </div>
      ) : (
        isOnline &&
        data.length === 0 && (
          <p className="text-center text-xl">
            Add your
            <NavLink
              to={`/add-blog/${id}`}
              className="underline underline-offset-2 text-blue-800 hover:text-blue-700 mx-1"
            >
              First
            </NavLink>
            One
          </p>
        )
      )}

      {/* send the data to the main component */}
      <div className="flex flex-col mx-[10%] sm:mx-[15%] md:mx-[20%] lg:mx-[25%] 2xl:mx-[30%] space-y-14 my-5">
        {data &&
          data.length > 0 &&
          data.map((blog) => (
            <Main
              key={blog._id}
              blog={blog}
              comments={blog.comments}
              setTrigger={setTrigger}
              isHome={false}
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
