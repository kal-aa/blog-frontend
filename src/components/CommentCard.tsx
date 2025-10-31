import { lazy, memo, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
  FaReply,
  FaTrashAlt,
} from "react-icons/fa";
import { relativeTime } from "../utils/relativeTime";
import { formatNumber } from "../utils/formatNumber";
import SeeMore from "./SeeMore";
import SuspenseFallback from "./SuspenseFallback";
import { useUser } from "../context/UserContext";
import { isObjectId } from "../utils/isObjectId";
import { fetchData } from "../utils/fetchBlogs";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setUserOfInterest } from "../features/blogSlice";
import { CommentCardProps, Reply } from "../types";
import { RootState } from "../store/store";
const ReplyList = lazy(() => import("./ReplyList"));

function CommentCard({
  optimComment,
  authorId,
  handleDeleteComment,
  handleSendReply,
  handleUndislike,
  handleUnlike,
  handleDislike,
  handleLike,
}: CommentCardProps) {
  const [optimReplies, setOptimReplies] = useState<Reply[]>([]);
  const [ShowReplyForm, setShowReplyForm] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [replyValue, setReplyValue] = useState("");
  const [replyCount, setReplyCount] = useState(0);
  const [isFullComment, setIsFullComment] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const commentValue = optimComment.comment;
  const { user } = useUser();
  const id = user?.id;

  const isHome = useSelector((state: RootState) => state.blog.isHome);
  const dispatch = useDispatch();

  const {
    data: replies,
    // isSuccess,
    // refetch,
  } = useQuery({
    queryKey: ["replies", { route: `comments/${optimComment._id}/replies` }],
    queryFn: fetchData<Reply[]>,
    enabled: isObjectId(optimComment._id),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (!id) return;
    setLikeCount(optimComment.likes.length);
    setDislikeCount(optimComment.dislikes.length);
    setThumbsUp(optimComment.likes.includes(id));
    setThumbsDown(optimComment.dislikes.includes(id));
  }, [optimComment.likes, optimComment.dislikes]);

  useEffect(() => {
    if (replies) {
      setOptimReplies(replies);
      setReplyCount(replies.length || 0);
    }
  }, [replies]);

  // reply input focus
  useEffect(() => {
    if (ShowReplyForm && inputRef.current) inputRef.current.focus();
  }, [ShowReplyForm]);

  const commenterName =
    optimComment.commenterName || user?.name || "Unknown user";

  return (
    <section className="bg-black rounded-xl">
      <div className="flex flex-col px-3 py-2 md:items-end md:flex-row md:justify-around">
        <div className="md:w-2/3">
          <div className="flex items-center space-x-1">
            <img
              onClick={() => {
                if (isHome && id === optimComment.commenterId) {
                  navigate(`/your-blogs`);
                } else if (isHome && id !== optimComment.commenterId) {
                  dispatch(setUserOfInterest(optimComment.commenterId));
                } else if (!isHome && id !== optimComment.commenterId) {
                  dispatch(setUserOfInterest(optimComment.commenterId));
                  navigate("/home");
                }
              }}
              src={
                optimComment.buffer && optimComment.mimetype
                  ? `data:${optimComment.mimetype};base64,${optimComment.buffer}`
                  : import.meta.env.VITE_PUBLIC_URL +
                    "assets/images/unknown-user.jpg"
              }
              alt="user"
              className="w-5 h-5 bg-white rounded-full cursor-pointer"
            />

            <p className="text-xs text-red-200">
              {authorId === optimComment.commenterId
                ? commenterName + " :The Author"
                : commenterName}
            </p>
          </div>

          {/* make the comment shorter (...) */}
          <p
            onClick={() => setIsFullComment((prev) => !prev)}
            className="mt-1 text-sm indent-1 "
          >
            <SeeMore value={commentValue} isFull={isFullComment} />
          </p>

          <p className="mt-1 text-xs text-red-300">
            {relativeTime(optimComment.timeStamp)}
          </p>
        </div>

        {/* like dislike reply icons */}
        <div className="flex items-center justify-around w-1/2 md:w-2/3">
          {/* like */}
          <div className="flex items-center space-x-3">
            {thumbsUp ? (
              <FaThumbsUp
                size={12}
                className="cursor-pointer hover:text-slate-400"
                onClick={() =>
                  handleUnlike({ optimComment, setThumbsUp, setLikeCount })
                }
              />
            ) : (
              <FaRegThumbsUp
                size={12}
                className="cursor-pointer hover:text-slate-400"
                onClick={() =>
                  handleLike({
                    dislikeCount,
                    optimComment,
                    setDislikeCount,
                    setLikeCount,
                    setThumbsDown,
                    setThumbsUp,
                    thumbsDown,
                  })
                }
              />
            )}
            <p className="-ml-3">{formatNumber(likeCount)}</p>
          </div>
          {/* dislike */}
          <div className="flex items-center space-x-3">
            {thumbsDown ? (
              <FaThumbsDown
                size={12}
                className="cursor-pointer hover:text-slate-400"
                onClick={() =>
                  handleUndislike({
                    optimComment,
                    setDislikeCount,
                    setThumbsDown,
                  })
                }
              />
            ) : (
              <FaRegThumbsDown
                size={12}
                className="cursor-pointer hover:text-slate-400"
                onClick={() =>
                  handleDislike({
                    likeCount,
                    optimComment,
                    setDislikeCount,
                    setLikeCount,
                    setThumbsUp,
                    setThumbsDown,
                    thumbsUp,
                  })
                }
              />
            )}
            <p className="-ml-3">{formatNumber(dislikeCount)}</p>
          </div>
          {/* reply */}
          <div className="flex items-center space-x-3">
            <FaReply
              size={12}
              className="cursor-pointer hover:text-slate-400"
              onClick={() => setShowReplyForm(!ShowReplyForm)}
            />
            <p
              onClick={() => setShowReplies((prev) => !prev)}
              className="pr-1 -ml-3 cursor-pointer hover:text-blue-400 hover:underline"
            >
              {formatNumber(replyCount)}
            </p>
          </div>
          {!isHome && (
            <FaTrashAlt
              size={12}
              className={`hover:animate-pulse ${
                isDeletingComment && "animate-spin"
              }`}
              onClick={() =>
                handleDeleteComment({ optimComment, setIsDeletingComment })
              }
            />
          )}
        </div>
      </div>

      {/* Reply form section */}
      {ShowReplyForm && (
        <div className="flex flex-col items-center mx-[10%]">
          <form
            onSubmit={(e) =>
              handleSendReply({
                e,
                optimComment,
                replyValue,
                setIsSendingReply,
                setOptimReplies,
                setReplyCount,
                setReplyValue,
                setShowReplies,
              })
            }
            className="flex justify-around w-full"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="reply"
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
              required
              className="w-2/4 px-2 py-1 text-blue-800 rounded-lg outline-none focus:ring-2 hover:ring-1 ring-white"
            />
            <button
              type="submit"
              disabled={isSendingReply}
              className="px-2 bg-blue-900 rounded-lg hover:bg-blue-800"
            >
              reply
            </button>
          </form>

          <p
            onClick={() => setShowReplies((prev) => !prev)}
            className="my-2 cursor-pointer hover:underline underline-offset-2"
          >
            {replyCount !== 1
              ? formatNumber(replyCount) + " Replies"
              : formatNumber(replyCount) + " Reply"}
          </p>
        </div>
      )}

      {/* Replies */}
      <div className="flex flex-col space-y-4">
        {showReplies ? (
          optimReplies.length === 0 ? (
            <p className="text-sm text-center text-red-300">No replies</p>
          ) : (
            <Suspense fallback={<SuspenseFallback />}>
              <ReplyList
                optimComment={optimComment}
                optimReplies={optimReplies}
                setOptimReplies={setOptimReplies}
                setReplyCount={setReplyCount}
              />
            </Suspense>
          )
        ) : (
          ""
        )}
      </div>
    </section>
  );
}

export default memo(CommentCard);
