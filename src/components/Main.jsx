import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaHeartBroken,
  FaRegComment,
} from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "react-router-dom";
import CommentsComp from "./Comments";

const Main = ({ blog, comments, setTrigger }) => {
  const [commentValue, setCommentValue] = useState("");
  const [iscommenting, setIsCommenting] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes.length);
  const [dislikeCount, setDislikeCount] = useState(blog.dislikes.length);
  const [commentCount, setcommentCount] = useState(comments.length);
  const [viewCount, setViewCount] = useState(blog.views.length);
  const [expand, setExpand] = useState(false);
  const commentsRef = useRef(null);
  const pTagRef = useRef(null);
  const { id } = useParams();

  const relativeTime = (x) => {
    const date = new Date(x);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const formatNumber = (x) => {
    if (x > 1_000_000_000) {
      return (x / 1_000_000_000).toFixed(1) + "B";
    } else if (x >= 1_000_000) {
      return (x / 1_000_000).toFixed(1) + "M";
    } else if (x >= 1_000) {
      return (x / 1_000).toFixed(1) + "K";
    }
    return x;
  };

  // Check if the click was outside the comments section and the p tag
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        commentsRef.current &&
        !commentsRef.current.contains(e.target) &&
        pTagRef.current &&
        !pTagRef.current.contains(e.target)
      ) {
        setShowComments(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // for the like and dislike icons
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

  // send comment
  const handleSendComment = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(url, {
        action: "comment",
        userId: id,
        blogId: blog._id,
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
        className="absolute top-0 left-0 w-10 h-10  rounded-br-2xl"
      />

      <div className="flex justify-between ml-5 mx-3">
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
              <FaHeart
                className="hover:text-blue-900 cursor-pointer"
                onClick={handleThumbsupClick}
              />
            ) : (
              <FaRegHeart
                className="hover:text-blue-900 cursor-pointer"
                onClick={handleRegThumbUpClick}
              />
            )}
            <p className="ml-2">{formatNumber(likeCount)}</p>
          </div>
          <div className="flex items-center">
            {thumbsDown ? (
              <FaHeartBroken
                className="hover:text-blue-900 cursor-pointer"
                onClick={handleThumbsDownClick}
              />
            ) : (
              <FaHeartBroken
                className="hover:stroke-blue-900 stroke-[45px] stroke-black fill-transparent cursor-pointer"
                onClick={handleRegThubsDownClick}
              />
            )}
            <p className="ml-2">{formatNumber(dislikeCount)}</p>
          </div>
          <div className="flex items-center">
            <FaRegComment
              className="hover:text-blue-900 cursor-pointer"
              onClick={() => setIsCommenting(!iscommenting)}
            />

            {/* Comments component */}
            {showComments && (
              <div
                ref={commentsRef}
                className="text-white absolute z-10 top-[80%] left-[5%] right-[5%] md:left-[15%] md:right-[15%] overflow-y-auto space-y-3 h-40"
              >
                {comments.length === 0 ? (
                  <div className="flex justify-center items-center bg-black h-20">
                    No comments
                  </div>
                ) : (
                  comments.map(
                    (comment) => (
                      (comment.authorId = blog.authorId),
                      (
                        <CommentsComp
                          key={comment._id}
                          comment={comment}
                          setTrigger={setTrigger}
                          relativeTime={relativeTime}
                          formatNumber={formatNumber}
                        />
                      )
                    )
                  )
                )}
              </div>
            )}

            <p className="ml-2">
              {!iscommenting && (
                <p
                  onClick={() => setShowComments((prev) => !prev)}
                  className="hover:underline cursor-pointer"
                  ref={pTagRef}
                >
                  {commentCount !== 1
                    ? formatNumber(commentCount) + " Comments"
                    : formatNumber(commentCount) + " Comment"}
                </p>
              )}
            </p>
          </div>
        </div>
        <div>
          {iscommenting && (
            <div className="flex flex-col items-center pt-5 md:pt-10 my-2 mx-[10%] bg-gray-400 rounded-xl">
              <form
                onSubmit={handleSendComment}
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
              <p
                onClick={() => setShowComments((prev) => !prev)}
                className="my-2 hover:underline underline-offset-2 cursor-pointer"
                ref={pTagRef}
              >
                {commentCount !== 1
                  ? formatNumber(commentCount) + " Comments"
                  : formatNumber(commentCount) + " Comment"}
              </p>
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
            className="inline text-blue-800 -mb-3 -mt-3 cursor-pointer"
            size={25}
            onClick={() => setExpand(false)}
          />
        ) : (
          <MdExpandMore
            className="inline text-blue-800 mb-0.5 cursor-pointer"
            size={25}
            onClick={handleSeeMore}
          />
        )}
        {!expand && formatNumber(viewCount)}
        {!expand && <span className="ml-1 text-xs">views</span>}
      </div>
    </section>
  );
};

Main.propTypes = {
  blog: PropTypes.object,
  comments: PropTypes.array,
  setTrigger: PropTypes.func,
};

export default Main;
