import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
  FaReply,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Replies from "./Replies";

const CommentsComp = ({ comment, setTrigger, relativeTime, formatNumber }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes.length);
  const [dislikeCount, setDislikeCount] = useState(comment.dislikes.length);
  const [replyValue, setReplyValue] = useState("");
  const [replyCount, setReplyCount] = useState(comment.replies.length);
  const [showReplies, setShowReplies] = useState(false);
  const { id } = useParams();

  // for the like and dislike icons
  useEffect(() => {
    const liked = comment.likes.includes(id);
    setThumbsUp(liked);

    const disliked = comment.dislikes.includes(id);
    setThumbsDown(disliked);
  }, [comment, id]);

  const url = `http://localhost:5000/likeDislike/${comment._id}`;
  const handleRegThumbUpClick = async () => {
    setThumbsUp(true);
    setLikeCount((prev) => prev + 1);
    if (thumbsDown) {
      setThumbsDown(false);
      setDislikeCount((prev) => prev - 1);
      try {
        await axios.patch(url, {
          action: "removeCommentDislike",
          userId: id,
        });
      } catch (error) {
        console.error("Error removing dislike:", error);
      }
    }
    try {
      await axios.patch(url, {
        action: "addCommentLike",
        userId: id,
      });
      setTrigger((prev) => !prev);
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
        action: "removeCommentLike",
        userId: id,
      });
      setTrigger((prev) => !prev);
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
        await axios.patch(url, { action: "removeCommentLike", userId: id });
      } catch (error) {
        console.log("Error removing like:", error);
      }
    }
    try {
      await axios.patch(url, { action: "addCommentDislike", userId: id });
      setTrigger((prev) => !prev);
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
        action: "removeCommentDislike",
        userId: id,
      });
      setTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error removing dislike:", error);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(url, {
        action: "reply",
        userId: id,
        reply: replyValue,
      });
      setReplyValue("");
      setReplyCount((prev) => prev + 1);
      setTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error comming", error);
    }
  };

  return (
    <section className="bg-black rounded-xl">
      <div className="flex flex-col md:items-center md:flex-row md:justify-around py-2 px-3">
        <div className="md:w-2/3">
          <div className="flex items-center space-x-1">
            <img
              src={
                comment.buffer && comment.mimetype
                  ? `data:${comment.mimetype};base64,${comment.buffer}`
                  : "/assets/images/unknown-user.jpg"
              }
              alt="user"
              className="w-5 h-5 rounded-full"
            />
            <p className="text-xs text-red-200">
              {comment.authorId === comment.commenterId
                ? comment.commenterName + " :Author"
                : comment.commenterName}
            </p>
          </div>

          <p className="text-sm">{comment.comment}</p>
          <p className="text-xs text-red-300">
            {relativeTime(comment.timeStamp)}
          </p>
        </div>
        <div className="flex justify-around items-center w-1/2 md:w-1/3">
          {thumbsUp ? (
            <FaThumbsUp
              size={12}
              className="hover:text-slate-400 cursor-pointer"
              onClick={handleThumbsupClick}
            />
          ) : (
            <FaRegThumbsUp
              size={12}
              className="hover:text-slate-400 cursor-pointer"
              onClick={handleRegThumbUpClick}
            />
          )}
          <p className="-ml-3">{formatNumber(likeCount)}</p>
          {thumbsDown ? (
            <FaThumbsDown
              size={12}
              className="hover:text-slate-400 cursor-pointer"
              onClick={handleThumbsDownClick}
            />
          ) : (
            <FaRegThumbsDown
              size={12}
              className="hover:text-slate-400 cursor-pointer"
              onClick={handleRegThubsDownClick}
            />
          )}
          <p className="-ml-3">{formatNumber(dislikeCount)}</p>
          <FaReply
            size={12}
            className="hover:text-slate-400 cursor-pointer"
            onClick={() => setIsReplying(!isReplying)}
          />
          <p
            onClick={() => setShowReplies((prev) => !prev)}
            className="-ml-3 hover:text-blue-400 cursor-pointer"
          >
            {!isReplying && formatNumber(replyCount)}
          </p>
        </div>
      </div>
      {isReplying && (
        <div className="flex flex-col items-center mx-[10%]">
          <form
            onSubmit={handleSendReply}
            className="w-full flex justify-around"
          >
            <input
              type="text"
              placeholder="reply"
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
              required
              className="w-2/4 py-1 px-2 rounded-lg outline-none focus:ring-2 hover:ring-1 ring-white text-blue-800"
            />
            <button
              type="submit"
              className="bg-blue-900 px-2 rounded-lg hover:bg-blue-800"
            >
              reply
            </button>
          </form>
          <p
            onClick={() => setShowReplies((prev) => !prev)}
            className="my-2 hover:underline underline-offset-2 cursor-pointer"
          >
            {replyCount !== 1
              ? formatNumber(replyCount) + " Replies"
              : formatNumber(replyCount) + " Reply"}
          </p>
        </div>
      )}

      {/* Replies */}
      <div className="flex flex-col items-center space-y-3">
        {showReplies ? (
          comment.replies.length === 0 ? (
            <div className="text-sm text-red-300 text-center">No replies</div>
          ) : (
            comment.replies.map(
              (reply) => (
                (reply.authorId = comment.authorId),
                (
                  <Replies
                    key={reply._id}
                    reply={reply}
                    relativeTime={relativeTime}
                    isReplying={isReplying}
                  />
                )
              )
            )
          )
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

CommentsComp.propTypes = {
  comment: PropTypes.object,
  setTrigger: PropTypes.func,
  relativeTime: PropTypes.func,
  formatNumber: PropTypes.func,
};

export default CommentsComp;
