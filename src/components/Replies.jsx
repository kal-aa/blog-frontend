import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const Replies = ({
  reply,
  relativeTime,
  setReplyCount,
  setTrigger,
  setUserOfInterest,
  isHome,
}) => {
  const [replyValue] = useState(reply.reply);
  const [isFullReply, setIsFullReply] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteReply = async () => {
    const delUrl = `https://blog-backend-sandy-three.vercel.app/likeDislike/${encodeURIComponent(
      reply._id
    )}`;
    setIsDeletingReply(true);
    try {
      await axios.patch(delUrl, {
        action: "removeReply",
        userId: reply.replierId,
      });
      setIsDeletingReply(false);
      setTrigger((prev) => !prev);
      setReplyCount((prev) => prev - 1);
    } catch (error) {
      setIsDeletingReply(false);
      console.error("Error deleting comment", error);
    }
  };

  return (
    <section className="flex flex-col items-center px-10">
      <div className="flex items-center space-x-1">
        <p className="text-xs text-red-200">
          {reply.authorId === reply.replierId
            ? " Author: " + reply.replierName
            : reply.replierName}
        </p>
        <img
          onClick={() => {
            // navigate to the clicked user's blogs
            if (id === reply.replierId) {
              navigate(`/your-blogs/${id}`);
            } else setUserOfInterest(reply.replierId);
          }}
          src={
            reply.buffer && reply.mimetype
              ? `data:${reply.mimetype};base64,${reply.buffer}`
              : import.meta.env.VITE_PUBLIC_URL +
                "assets/images/unknown-user.jpg"
          }
          alt="user"
          className="w-5 h-5 rounded-full cursor-pointer"
        />
      </div>

      {/* make the replies shorter before click */}
      <p
        onClick={() => setIsFullReply((prev) => !prev)}
        className="text-sm text-center"
      >
        {isFullReply ? replyValue : replyValue.slice(0, 15) + "..."}
        <span className="ml-1 text-blue-300 text-xs hover:text-blue-400 cursor-pointer">
          {!isFullReply && "-see more-"}
        </span>
      </p>

      <div className="flex items-center">
        <p className="text-[10px] text-red-300 -mt-1.5">
          {relativeTime(reply.timeStamp)}
        </p>
        {/* Delete icon */}
        {!isHome && (
          <FaTrashAlt
            size={12}
            className={`hover:animate-pulse mb-1.5 ml-1 ${
              isDeletingReply && "animate-spin"
            }`}
            onClick={handleDeleteReply}
          />
        )}
      </div>
    </section>
  );
};

Replies.propTypes = {
  reply: PropTypes.object,
  relativeTime: PropTypes.func,
  setReplyCount: PropTypes.func,
  setTrigger: PropTypes.func,
  setUserOfInterest: PropTypes.func,
  isHome: PropTypes.bool,
};

export default Replies;
