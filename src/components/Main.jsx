import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaHeartBroken,
  FaRegComment,
  FaRegEdit,
  FaTrash,
} from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "react-router-dom";
import CommentsComp from "./Comments";
import PropTypes from "prop-types";
import { BeatLoader } from "react-spinners";

const Main = ({
  blog,
  comments,
  setTrigger,
  isHome = true,
  handleDelete,
  handleUpdate,
  updateError,
}) => {
  const [commentValue, setCommentValue] = useState("");
  const [showCommentSection, setShowCommentSection] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes.length);
  const [dislikeCount, setDislikeCount] = useState(blog.dislikes.length);
  const [commentCount, setCommentCount] = useState(comments.length);
  const [viewCount, setViewCount] = useState(blog.views.length);
  const [expand, setExpand] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  //  for the YourtodosPage
  const [editTitleValue, setEditTitleValue] = useState(blog.title || "");
  const [editBodyValue, setEditBodyValue] = useState(blog.body || "");
  const [editTitlePen, setEditTitlePen] = useState(false);
  const [editBodyPen, setEditBodyPen] = useState(false);
  const [readyToUpdate, setReadyToUpdate] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  //
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

  //  check if it's valid to be updated
  useEffect(() => {
    if (
      (editTitleValue.trim() !== blog.title ||
        editBodyValue.trim() !== blog.body) &&
      editBodyValue.length >= 100 &&
      editTitleValue !== ""
    ) {
      setReadyToUpdate(true);
      blog.editTitleValue = editTitleValue;
      blog.editBodyValue = editBodyValue;
    } else {
      setReadyToUpdate(false);
    }
  }, [blog, editTitleValue, editBodyValue, editTitlePen, editBodyPen]);

  const url = `https://blog-backend-sandy-three.vercel.app/likeDislike/${encodeURIComponent(
    blog._id
  )}`;
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
      try {
        await axios.patch(url, {
          action: "addView",
          userId: id,
        });
        setViewCount((prev) => prev + 1);
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
      setIsSendingComment(true);
      await axios.patch(url, {
        action: "comment",
        userId: id,
        blogId: blog._id,
        comment: commentValue,
      });

      setIsSendingComment(false);
      setCommentValue("");
      setCommentCount((prev) => prev + 1);
      setTrigger((prev) => !prev);
    } catch (error) {
      setIsSendingComment(false);
      console.error("Error comming", error);
    }
  };

  return (
    <section className="mainContainer">
      {/* profile pic */}
      {isHome && (
        <img
          src={
            blog.buffer && blog.mimetype
              ? `data:${blog.mimetype};base64,${blog.buffer}`
              : import.meta.env.VITE_PUBLIC_URL +
                "assets/images/unknown-user.jpg"
          }
          alt="user"
          className="absolute top-0 left-0 w-10 h-10  rounded-br-2xl"
        />
      )}

      <div className="flex justify-between ml-5 mx-3">
        {/* Right section */}
        <div className="flex flex-col capitalize">
          {isHome && !expand && (
            <p className="capitalize text-xs md:text-sm ml-0.5">
              by: {blog.author}
            </p>
          )}
          <div className="flex items-end space-x-1">
            {!editTitlePen && (
              <h3 className="inline text-xl font-bold">{blog.title}</h3>
            )}
            {editTitlePen && (
              <input
                value={editTitleValue}
                onChange={(e) => setEditTitleValue(e.target.value)}
                placeholder="Title"
                className="w-1/2 px-2 py-1 rounded-md outline-none ring-2 hover:rounded-lg focus:bg-gray-100"
              />
            )}
            {!isHome && (
              <FaRegEdit
                title="Edit the title"
                size={13}
                onClick={() => setEditTitlePen((prev) => !prev)}
                className="mb-1 hover:text-blue-800"
              />
            )}
          </div>
          {isHome ? (
            expand && (
              <p className="capitalize text-xs md:text-sm ml-1.5">
                by: {blog.author}
              </p>
            )
          ) : (
            <p className="text-sm">
              {formatNumber(viewCount)}
              {viewCount !== 1 ? " Views" : " View"}
            </p>
          )}
        </div>

        {/* Left section */}
        <p className="date-style">{relativeTime(blog.createdAt)}</p>
      </div>

      {/* sample body */}
      <p className="ml-3 mt-2 break-words leading-4">
        {isHome && !expand && blog.body.slice(0, 50) + "..."}
      </p>

      {/* The hidden part in home */}
      <div className={!isHome ? "" : expand ? "" : "hidden"}>
        <div className="my-2 px-3 ">
          {!editBodyPen ? (
            <p className="inline indent-1 break-words leading-4">{blog.body}</p>
          ) : (
            <textarea
              rows={4}
              value={editBodyValue}
              onChange={(e) => setEditBodyValue(e.target.value)}
              placeholder="Your updated description should be 100 characters or more"
              className="w-full px-2 py-1 rounded-md outline-none ring-2 hover:rounded-lg focus:bg-gray-100"
            />
          )}
          {!isHome && (
            <FaRegEdit
              title="Edit the body"
              size={13}
              onClick={() => setEditBodyPen((prev) => !prev)}
              className={`hover:text-blue-800 inline ml-1 ${
                editBodyPen && "-mt-6"
              }`}
            />
          )}
        </div>
        <div className="flex justify-around items-center">
          {/* Like */}
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

          {/* Dislike */}
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

          {/* Comments */}
          <div className="flex items-center">
            <FaRegComment
              className="hover:text-blue-900 cursor-pointer"
              onClick={() => setShowCommentSection(!showCommentSection)}
            />

            {/* Comments component */}
            {showComments && (
              <div
                ref={commentsRef}
                className="text-white absolute z-0 bottom-[33%] left-[5%] right-[5%] md:left-[15%] md:right-[15%] overflow-y-auto space-y-3 min-h-10 max-h-48"
              >
                {comments.length === 0 ? (
                  <p className="flex justify-center items-center bg-black rounded-full h-10">
                    No comments
                  </p>
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
                          setCommentCount={setCommentCount}
                          isHome={isHome}
                        />
                      )
                    )
                  )
                )}
              </div>
            )}

            {/* Comments count */}
            {!showCommentSection && (
              <p
                onClick={() => setShowComments((prev) => !prev)}
                className="hover:underline cursor-pointer ml-2"
                ref={pTagRef}
              >
                {commentCount !== 1
                  ? formatNumber(commentCount) + " Comments"
                  : formatNumber(commentCount) + " Comment"}
              </p>
            )}
          </div>
        </div>

        {/* Comment form section */}
        {showCommentSection && (
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
                disabled={isSendingComment}
                className="bg-black text-white px-4 rounded-lg hover:bg-gray-900"
              >
                {isSendingComment ? (
                  <div className="flex items-end">
                    <span>post</span>
                    <BeatLoader size={2} color="white" className="mb-1" />
                  </div>
                ) : (
                  "post"
                )}
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

      {/* See more and less */}
      {isHome && (
        <div className="mt-2">
          <span
            onClick={() => setExpand(false)}
            className="inline text-blue-800 hover:text-blue-600 ml-3"
          >
            {expand && "Less"}
          </span>
          <span
            onClick={handleSeeMore}
            className="text-blue-800 hover:text-blue-600"
          >
            {!expand && "See more"}
          </span>
          {expand ? (
            <MdExpandLess
              className="inline text-blue-800 hover:text-blue-600 -mb-3 -mt-3 cursor-pointer"
              size={25}
              onClick={() => setExpand(false)}
            />
          ) : (
            <MdExpandMore
              className="inline text-blue-800 hover:text-blue-600 mb-0.5 cursor-pointer"
              size={25}
              onClick={handleSeeMore}
            />
          )}
          {!expand && formatNumber(viewCount)}
          {!expand && (
            <span className="ml-1 text-xs">
              {viewCount !== 1 ? " Views" : " View"}
            </span>
          )}
        </div>
      )}

      {/* Update and Delete btns, along with update Error */}
      {!isHome && (
        <div>
          <div className="text-center -mt-1 -mb-3 leading-4 text-red-500">
            {updateError || "\u00A0"}
          </div>

          <div className="flex justify-around mt-5">
            <button
              onClick={() =>
                handleUpdate(
                  blog,
                  setEditTitlePen,
                  setEditBodyPen,
                  setIsUpdating
                )
              }
              disabled={!readyToUpdate || isUpdating}
              className={`text-white px-3 py-1 rounded-lg ${
                readyToUpdate ? "bg-gray-600 hover:bg-gray-800" : "bg-gray-500"
              }`}
            >
              {isUpdating ? (
                <div className="flex items-end">
                  update
                  <BeatLoader
                    size={8}
                    color="white"
                    className="mb-1 ml-1 w-5"
                  />
                </div>
              ) : (
                "Update"
              )}
            </button>
            <button
              onClick={() => handleDelete(blog._id, setIsDeleting)}
              disabled={isDeleting}
              className="text-white px-3 py-1 rounded-lg bg-gray-600 hover:bg-gray-800"
            >
              {isDeleting ? (
                <div className="flex items-end">
                  delete
                  <BeatLoader
                    size={8}
                    color="white"
                    className="mb-1 ml-1 w-5"
                  />
                </div>
              ) : (
                <div>
                  Delete
                  <FaTrash
                    size={12}
                    className="inline hover:animate-bounce ml-1"
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

Main.propTypes = {
  blog: PropTypes.object,
  comments: PropTypes.array,
  setTrigger: PropTypes.func,
  isHome: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  isUpdating: PropTypes.bool,
  isDeleting: PropTypes.bool,
  updateError: PropTypes.string,
};

export default Main;
