import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { relativeTime } from "../utils/relativeTime";
import { useUser } from "../context/UserContext";
import SeeMore from "./SeeMore";
import { useDispatch, useSelector } from "react-redux";
import { setUserOfInterest } from "../features/blogSlice";
import { RootState } from "../store/store";
import { ReplyCardProps } from "../types/reply";

function ReplyCard({
  authorId,
  handleDeleteReply,
  optimReply,
}: ReplyCardProps) {
  const [isFullReply, setIsFullReply] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const id = user?.id;
  const isHome = useSelector((state: RootState) => state.blog.isHome);
  const dispatch = useDispatch();

  const replyValue = optimReply.reply;
  const replierName = optimReply.replierName || user?.name || "Unkonwn user";

  return (
    <section className="flex flex-col items-center px-10">
      <div className="flex items-center space-x-1">
        <p className="text-xs text-red-200">
          {authorId === optimReply.replierId
            ? replierName.split(" ")[0] + " (Author)"
            : replierName}
        </p>
        <img
          title={`more from ${replierName.toUpperCase()}`}
          onClick={() => {
            if (isHome && id === optimReply.replierId) {
              navigate(`/your-blogs`);
            } else if (isHome && id !== optimReply.replierId) {
              dispatch(setUserOfInterest(optimReply.replierId));
            } else {
              dispatch(setUserOfInterest(optimReply.replierId));
              navigate("/home");
            }
          }}
          src={
            optimReply.buffer && optimReply.mimetype
              ? `data:${optimReply.mimetype};base64,${optimReply.buffer}`
              : import.meta.env.VITE_PUBLIC_URL +
                "assets/images/unknown-user.jpg"
          }
          alt={replierName.toUpperCase()}
          className="w-5 h-5 text-xs bg-white rounded-full cursor-pointer"
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
          {relativeTime(optimReply.createdAt)}
        </p>
        {/* Delete icon */}
        {!isHome && (
          <FaTrashAlt
            title={isDeletingReply ? "deleting..." : "delete reply"}
            size={12}
            className={`text-red-300 hover:text-red-400 mb-1.5 ml-1 ${
              isDeletingReply && "animate-spin"
            }`}
            onClick={() =>
              handleDeleteReply({ optimReply, setIsDeletingReply })
            }
          />
        )}
      </div>
    </section>
  );
}

export default memo(ReplyCard);
