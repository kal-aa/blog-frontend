import { lazy, memo, Suspense, useEffect, useRef, useState } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaHeartBroken,
  FaRegComment,
  FaRegEdit,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { formatNumber } from "../utils/formatNumber";
import SuspenseFallback from "./SuspenseFallback";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { BlogDetailViewProps } from "../types/blog";
const CommentList = lazy(() => import("./CommentList"));

function BlogDetailView({
  blog,
  commentCount,
  commentRef,
  commentValue,
  dislikeCount,
  editBodyPen,
  editBodyValue,
  expand,
  handleRegThumbsUpClick,
  handleRegThumbsDownClick,
  handleSendComment,
  handleThumbsDownClick,
  handleThumbsUpClick,
  isSendingComment,
  likeCount,
  optimComments,
  pTagRef,
  readyToUpdate,
  setCommentCount,
  setCommentValue,
  setEditBodyPen,
  setEditBodyValue,
  setOptimComments,
  setShowComments,
  showComments,
  thumbsDown,
  thumbsUp,
  updateBtnRef,
}: BlogDetailViewProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyInpRef = useRef<HTMLTextAreaElement>(null);
  const isHome = useSelector((state: RootState) => state.blog.isHome);

  // comment Input focus
  useEffect(() => {
    if (showCommentForm) inputRef.current?.focus();
  }, [showCommentForm]);

  useEffect(() => {
    if (editBodyPen) {
      bodyInpRef.current?.focus();
      bodyInpRef.current?.select?.();
    }
  }, [bodyInpRef, editBodyPen]);

  return (
    <div className={isHome ? (expand ? "" : "hidden") : ""}>
      <div className="px-3 my-2 ">
        {!editBodyPen ? (
          <p className="inline leading-4 break-words indent-1">{blog.body}</p>
        ) : (
          <textarea
            ref={bodyInpRef}
            rows={4}
            value={editBodyValue}
            onChange={(e) => setEditBodyValue(e.target.value)}
            placeholder="Your updated description should be 100 characters or more"
            className="w-[90%] px-2 py-1 rounded-md outline-none ring-2 hover:rounded-lg focus:bg-gray-100"
          />
        )}
        {!isHome &&
          (editBodyPen ? (
            readyToUpdate ? (
              <FaCheckCircle
                onClick={() => updateBtnRef.current?.click()}
                size={18}
                className="inline mb-1 ml-2 text-red-600/60 hover:text-red-600/50"
              />
            ) : (
              <FaTimesCircle
                onClick={() => setEditBodyPen(false)}
                size={18}
                className="inline mb-1 ml-2 text-red-600/60 hover:text-red-600/50"
              />
            )
          ) : (
            <FaRegEdit
              title="Edit the body"
              size={18}
              onClick={() => setEditBodyPen(!editBodyPen)}
              className="inline ml-1 text-red-600 hover:text-red-600/80"
            />
          ))}
      </div>
      <div className="flex items-center justify-around">
        {/* Like */}
        <div className="flex items-center">
          {thumbsUp ? (
            <FaHeart
              className="cursor-pointer hover:text-blue-900"
              onClick={handleThumbsUpClick}
            />
          ) : (
            <FaRegHeart
              className="cursor-pointer hover:text-blue-900"
              onClick={handleRegThumbsUpClick}
            />
          )}
          <p className="ml-2">{formatNumber(likeCount)}</p>
        </div>

        {/* Dislike */}
        {isHome && (
          <div className="flex items-center">
            {thumbsDown ? (
              <FaHeartBroken
                className="cursor-pointer hover:text-blue-900"
                onClick={handleThumbsDownClick}
              />
            ) : (
              <FaHeartBroken
                className="hover:stroke-blue-900 stroke-[45px] stroke-black fill-transparent cursor-pointer"
                onClick={handleRegThumbsDownClick}
              />
            )}
            <p className="ml-2">{formatNumber(dislikeCount)}</p>
          </div>
        )}

        {/* Comments */}
        <div className="flex items-center">
          <FaRegComment
            className="cursor-pointer hover:text-blue-900"
            onClick={() => setShowCommentForm((prev) => !prev)}
          />

          {/* Comments component */}
          {showComments && (
            <div
              ref={commentRef}
              className={`text-white absolute z-0 bottom-[20%] -left-[10%] right-[20%] overflow-y-auto space-y-3 ${
                optimComments.length <= 1 ? "h-auto" : "h-52"
              }`}
            >
              {optimComments.length === 0 ? (
                <p className="flex items-center justify-center h-10 bg-black rounded-full">
                  No comments
                </p>
              ) : (
                <Suspense fallback={<SuspenseFallback />}>
                  <CommentList
                    blog={blog}
                    optimComments={optimComments}
                    setCommentCount={setCommentCount}
                    setOptimComments={setOptimComments}
                  />
                </Suspense>
              )}
            </div>
          )}

          {/* Comments count */}
          {!showCommentForm && (
            <p
              onClick={() => setShowComments(!showComments)}
              className="ml-2 cursor-pointer hover:underline"
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
      {showCommentForm && (
        <div className="flex flex-col items-center pt-5 md:pt-10 my-2 mx-[10%] bg-gray-400 rounded-xl">
          <form
            onSubmit={handleSendComment}
            className="flex justify-around w-full"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="comment"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              required
              className="w-3/6 px-2 py-1 rounded-lg outline-none focus:ring-2 hover:ring-1 ring-white"
            />
            <button
              type="submit"
              disabled={isSendingComment}
              className="px-4 text-white bg-black rounded-lg hover:bg-gray-900"
            >
              post
            </button>
          </form>

          <p
            onClick={() => setShowComments(!showComments)}
            className="my-2 cursor-pointer hover:underline underline-offset-2"
            ref={pTagRef}
          >
            {commentCount !== 1
              ? formatNumber(commentCount) + " Comments"
              : formatNumber(commentCount) + " Comment"}
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(BlogDetailView);
