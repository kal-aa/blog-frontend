import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import YourBlogs from "../components/YourBlogs";
import { RingLoader } from "react-spinners";

const YourBlogsPage = () => {
  const [isFetchingBlogs, setIsFetchingBlogs] = useState(true);
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsFetchingBlogs(true);
        const url = `http://localhost:5000/your-blogs/${id}`;

        const res = await fetch(url);
        const dataArray = await res.json();

        setIsFetchingBlogs(false);
        setData(dataArray);
      } catch (error) {
        setIsFetchingBlogs(false);
        console.log("Error fetching blogs", error);
      }
    };
    fetchBlogs();
  }, [id]);

  const handleComment = (commentValue) => {
    alert(commentValue);
  };

  const handleDelete = () => {
    window.confirm("Are you sure you want to delete this blog?");
  };

  const handleUpdate = () => {
    alert("updated");
  };

  return (
    <>
      {isFetchingBlogs ? (
        <div className="flex flex-col justify-center items-center text-blue-800 min-h-[50vh]">
          <RingLoader color="darkBlue" size={100} speedMultiplier={1.5} />
          <p>please wait...</p>
        </div>
      ) : (
        data.length === 0 && (
          <p className="text-center text-xl">
            You have no{" "}
            <NavLink
              to={`/add-blog/${id}`}
              className="underline underline-offset-2 text-blue-800 hover:text-blue-700"
            >
              blogs
            </NavLink>{" "}
            yet
          </p>
        )
      )}
      <div className="flex flex-col mx-[10%] sm:mx-[15%] md:mx-[20%] lg:mx-[25%] 2xl:mx-[30%] space-y-14 my-5">
        {data.length !== 0 &&
          data.map((blog) => (
            <YourBlogs
              key={blog._id}
              handleComment={handleComment}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              isFetchingBlogs={isFetchingBlogs}
              blog={blog}
            />
          ))}
      </div>
    </>
  );
};

export default YourBlogsPage;
