import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegThumbsDown,
  FaThumbsDown,
  FaRegComment,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "react-router-dom";

const YourBlogs = ({ handleComment, handleUpdate, handleDelete, blog }) => {
  const [commentValue, setCommentValue] = useState("");
  const [iscommenting, setIsCommenting] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes.length);
  const [dislikeCount, setDislikeCount] = useState(blog.dislikes.length);
  const [commentCount] = useState(blog.comments.length);
  const { id } = useParams();

  // const api = axios.create({
  //   baseURL: "https://your-backend-api.com/api", // Replace with your API URL
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${localStorage.getItem("token")}`, // Optional: for authenticated requests
  //   },
  // });

  const relativeTime = (x) => {
    const date = new Date(x);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  useEffect(() => {
    const liked = blog.likes.includes(id);
    setThumbsUp(liked);

    const disliked = blog.dislikes.includes(id);
    setThumbsDown(disliked);
  }, [blog, id]);

  const url = `http://localhost:5000/like/${blog._id}`;

  //  setThumbsUp(true) add like
  const handleRegThumbUpClick = async () => {
    setThumbsUp(true);
    setLikeCount((prev) => prev + 1);
    if (thumbsDown) {
      setThumbsDown(false);
      setDislikeCount((prev) => prev - 1);
      try {
        await axios.patch(url, {
          action: "removeDislike",
          userId: id,
        });
      } catch (error) {
        console.error("Error removing dislike:", error);
      }
    }
    try {
      await axios.patch(url, {
        action: "addLike",
        userId: id,
      });
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  //  setThumbsUp(false) remove like
  const handleThumbsupClick = async () => {
    setThumbsUp(false);
    setLikeCount((prev) => prev - 1);
    try {
      await axios.patch(url, {
        action: "removeLike",
        userId: id,
      });
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

  //  setThumbsDown(true) add dislike
  const handleRegThubsDownClick = async () => {
    setThumbsDown(true);
    setDislikeCount((prev) => prev + 1);
    if (thumbsUp) {
      setThumbsUp(false);
      setLikeCount((prev) => prev - 1);
      try {
        await axios.patch(url, { action: "removeLike", userId: id });
      } catch (error) {
        console.log("Error removing like:", error);
      }
    }
    try {
      await axios.patch(url, { action: "addDislike", userId: id });
    } catch (error) {
      console.log("Error removing like:", error);
    }
  };

  //  setThumbsDown(false)  remove dislike
  const handleThumbsDownClick = async () => {
    setThumbsDown(false);
    setDislikeCount((prev) => prev - 1);
    try {
      await axios.patch(url, {
        action: "removeDislike",
        userId: id,
      });
    } catch (error) {
      console.error("Error removing dislike:", error);
    }
  };

  return (
    <>
      <section
        key={blog._id}
        className="px-2 py-4 shadow-xl shadow-gray-400 bg-pink-300 rounded-lg"
      >
        <div className="flex justify-between mx-3">
          <div className="text-xl font-bold ml-3">{blog.title}</div>
          <div className="border-black -mt-4 -mr-5 py-4 px-5 bg-black text-white text-sm font-black rounded-bl-3xl">
            {relativeTime(blog.createdAt)}
          </div>
        </div>
        <div className="my-4 px-5 indent-3">{blog.body}</div>
        <div className="flex justify-around items-center">
          <div className="flex items-center">
            {thumbsUp ? (
              <FaThumbsUp
                className="hover:text-blue-900"
                onClick={handleThumbsupClick}
              />
            ) : (
              <FaRegThumbsUp
                className="hover:text-blue-900"
                onClick={handleRegThumbUpClick}
              />
            )}
            <p className="ml-2">{likeCount}</p>
          </div>
          <div className="flex items-center">
            {thumbsDown ? (
              <FaThumbsDown
                className="hover:text-blue-900"
                onClick={handleThumbsDownClick}
              />
            ) : (
              <FaRegThumbsDown
                className="hover:text-blue-900"
                onClick={handleRegThubsDownClick}
              />
            )}
            <p className="ml-2">{dislikeCount}</p>
          </div>
          <div className="flex items-center">
            <FaRegComment
              className="hover:text-blue-900"
              onClick={() => setIsCommenting(!iscommenting)}
            />
            <p className="ml-2">
              {!iscommenting && commentCount + " comments"}
            </p>
          </div>
        </div>
        <div>
          {iscommenting && (
            <div className="flex flex-col items-center pt-5 md:pt-10 my-2 mx-[10%] bg-gray-400 rounded-xl">
              <div className="w-full flex justify-around">
                <input
                  type="text"
                  placeholder="comment"
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  className="w-3/6 py-1 px-2 rounded-lg outline-none focus:ring-2 hover:ring-1 ring-white"
                />
                <button
                  onClick={() => handleComment(commentValue)}
                  className="bg-black text-white px-4 rounded-lg hover:bg-gray-600"
                >
                  post
                </button>
              </div>
              <div className="my-2 hover:underline underline-offset-2">
                {commentCount} comments
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-around mt-5">
          <button
            onClick={handleDelete}
            className="bg-gray-600 text-white px-4 py-1 rounded-lg hover:bg-gray-800"
          >
            delete
          </button>
          <button
            onClick={handleUpdate}
            className="bg-gray-600 text-white px-4 py-1 rounded-lg hover:bg-gray-800"
          >
            update
          </button>
        </div>
      </section>
    </>
  );
};

YourBlogs.propTypes = {
  handleComment: PropTypes.func,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  blog: PropTypes.object,
};

export default YourBlogs;
