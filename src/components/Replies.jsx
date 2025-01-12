import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const Replies = ({
  reply,
  relativeTime,
  setReplyCount,
  setTrigger,
  isHome,
}) => {
  const [isDeletingReply, setIsDeletingReply] = useState(false);

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
          src={
            reply.buffer && reply.mimetype
              ? `data:${reply.mimetype};base64,${reply.buffer}`
              : import.meta.env.VITE_PUBLIC_URL +
                "assets/images/unknown-user.jpg"
          }
          alt="user"
          className="w-5 h-5 rounded-full"
        />
      </div>

      <p className="text-sm">{reply.reply}</p>

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
  isHome: PropTypes.bool,
};

export default Replies;
