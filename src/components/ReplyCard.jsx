import { memo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import { relativeTime } from "../utils/relativeTime";
import SeeMore from "./SeeMore";

function ReplyCard(data) {
  const { handleDeleteReply, isHome, optimReply, setUserOfInterest } = data;
  const [isFullReply, setIsFullReply] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const replyValue = optimReply.reply;
  const replierName = optimReply.replierName || "Unkonwn user";

  return (
    <section className="flex flex-col items-center px-10">
      <div className="flex items-center space-x-1">
        <p className="text-xs text-red-200">
          {optimReply.authorId === optimReply.replierId
            ? " Author: " + replierName
            : replierName}
        </p>
        <img
          onClick={() => {
            // navigate to the clicked user's blogs
            if (id === optimReply.replierId) {
              navigate(`/your-blogs/${id}`);
            } else setUserOfInterest(optimReply.replierId);
          }}
          src={
            optimReply.buffer && optimReply.mimetype
              ? `data:${optimReply.mimetype};base64,${optimReply.buffer}`
              : import.meta.env.VITE_PUBLIC_URL +
                "assets/images/unknown-user.jpg"
          }
          alt="user"
          className="w-5 h-5 bg-white rounded-full cursor-pointer"
        />
      </div>

      <p
        onClick={() => setIsFullReply((prev) => !prev)}
        className="mb-1 text-sm text-center"
      >
        <SeeMore value={replyValue} isFull={isFullReply} />
      </p>

      <div className="flex items-center">
        <p className="text-[10px] text-red-300 -mt-1.5">
          {relativeTime(optimReply.timeStamp)}
        </p>
        {/* Delete icon */}
        {!isHome && (
          <FaTrashAlt
            size={12}
            className={`hover:animate-pulse mb-1.5 ml-1 ${
              isDeletingReply && "animate-spin"
            }`}
            onClick={() => handleDeleteReply(optimReply, setIsDeletingReply)}
          />
        )}
      </div>
    </section>
  );
}

ReplyCard.propTypes = {
  handleDeleteReply: PropTypes.func,
  isHome: PropTypes.bool,
  optimReply: PropTypes.object,
  setUserOfInterest: PropTypes.func,
};

export default memo(ReplyCard);
