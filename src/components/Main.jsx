import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegThumbsDown,
  FaThumbsDown,
  FaRegComment,
} from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "react-router-dom";

const Main = ({ blog, setTrigger }) => {
  const [commentValue, setCommentValue] = useState("");
  const [iscommenting, setIsCommenting] = useState(true);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes.length);
  const [dislikeCount, setDislikeCount] = useState(blog.dislikes.length);
  const [commentCount, setcommentCount] = useState(blog.comments.length);
  const [viewCount, setViewCount] = useState(blog.views.length);
  const [expand, setExpand] = useState(false);
  const { id } = useParams();

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

  const url = `http://localhost:5000/likeDislike/${blog._id}`;
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

  //  view count
  const handleSeeMore = async () => {
    setExpand(true);
    if (!blog.views.includes(id)) {
      setViewCount((prev) => prev + 1);
      try {
        await axios.patch(url, {
          action: "addView",
          userId: id,
        });
        setTrigger((prev) => !prev);
      } catch (error) {
        console.error("Error adding view:", error);
      }
    }
  };

  // comment
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(url, {
        action: "comment",
        userId: id,
        comment: commentValue,
      });
      setCommentValue("");
      setcommentCount((prev) => prev + 1);
      setTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error comming", error);
    }
  };

  return (
    <section
      key={blog._id}
      className="relative pr-2 p-6 shadow-xl shadow-gray-400 bg-pink-300 rounded-lg"
    >
      <img
        src={
          blog.buffer && blog.mimetype
            ? `data:${blog.mimetype};base64,${blog.buffer}`
            : "/assets/images/unknown-user.jpg"
        }
        alt="user"
        className="absolute top-0 left-0 w-10 h-10  rounded-br-3xl"
      />

      <div className="flex justify-between mx-3">
        <div className="flex flex-col capitalize">
          {!expand && (
            <div className="flex items-center space-x-2">
              <p className="capitalize text-xs md:text-sm ml-0.5">
                by: {blog.author}
              </p>
            </div>
          )}
          <h3 className="text-xl font-bold">{blog.title}</h3>
          {expand && (
            <p className="capitalize text-xs md:text-sm ml-1.5">
              by: {blog.author}
            </p>
          )}
        </div>
        <p className="date-style">{relativeTime(blog.createdAt)}</p>
      </div>

      <p className="ml-3 mt-2">{!expand && blog.body.slice(0, 50) + "..."}</p>
      <div className={expand ? "" : "hidden"}>
        <p className="my-2 px-3 indent-1">{blog.body}</p>
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
              {!iscommenting
                ? commentCount !== 1
                  ? commentCount + " Comments"
                  : commentCount + " Comment"
                : ""}
            </p>
          </div>
        </div>
        <div>
          {iscommenting && (
            <div className="flex flex-col items-center pt-5 md:pt-10 my-2 mx-[10%] bg-gray-400 rounded-xl">
              <form
                onSubmit={handleComment}
                className="w-full flex justify-around"
              >
                <input
                  type="text"
                  placeholder="comment"
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  required
                  className="w-3/6 py-1 px-2 rounded-lg outline-none focus:ring-2 hover:ring-1 ring-white"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 rounded-lg hover:bg-gray-900"
                >
                  post
                </button>
              </form>
              <div className="my-2 hover:underline underline-offset-2">
                {commentCount !== 1
                  ? commentCount + " Comments"
                  : commentCount + " Comment"}
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <button
          onClick={() => setExpand(false)}
          className="inline text-blue-800 ml-3"
        >
          {expand && "Less"}
        </button>
        <button onClick={handleSeeMore} className="text-blue-800">
          {!expand && "See more"}
        </button>
        {expand ? (
          <MdExpandLess
            className="inline text-blue-800 -mb-3 -mt-3"
            size={25}
            onClick={() => setExpand(false)}
          />
        ) : (
          <MdExpandMore
            className="inline text-blue-800 mb-0.5"
            size={25}
            onClick={handleSeeMore}
          />
        )}
        {!expand && viewCount}
        {!expand && <span className="ml-1 text-xs">views</span>}
      </div>
    </section>
  );
};

Main.propTypes = {
  blog: PropTypes.object,
  setTrigger: PropTypes.func,
};

export default Main;
