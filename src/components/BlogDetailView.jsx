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
import PropTypes from "prop-types";
import { formatNumber } from "../utils/formatNumber";
import SuspenseFallback from "./SuspenseFallback";
const CommentList = lazy(() => import("./CommentList"));

function BlogDetailView(data) {
  const {
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
    handleThumbsupClick,
    isHome,
    isSendingComment,
    likeCount,
    onInteractionUpdate,
    optimComments,
    pTagRef,
    readyToUpdate,
    setCommentCount,
    setCommentValue,
    setEditBodyPen,
    setEditBodyValue,
    setOptimComments,
    setShowComments,
    setUserOfInterest,
    showComments,
    thumbsDown,
    thumbsUp,
    updateBtnRef,
  } = data;
  const [showCommentForm, setShowCommentForm] = useState(false);
  const inputRef = useRef(null);

  // comment Input focus
  useEffect(() => {
    if (showCommentForm && inputRef.current) inputRef.current.focus();
  }, [showCommentForm]);

  return (
    <div className={isHome ? (expand ? "" : "hidden") : ""}>
      <div className="px-3 my-2 ">
        {!editBodyPen ? (
          <p className="inline leading-4 break-words indent-1">{blog.body}</p>
        ) : (
          <textarea
            rows={4}
            value={editBodyValue}
            onChange={(e) => setEditBodyValue(e.target.value)}
            placeholder="Your updated description should be 100 characters or more"
            className="w-full px-2 py-1 rounded-md outline-none ring-2 hover:rounded-lg focus:bg-gray-100"
          />
        )}
        {!isHome &&
          (editBodyPen ? (
            readyToUpdate ? (
              <FaCheckCircle
                onClick={() => {
                  if (updateBtnRef.current) updateBtnRef.current.click();
                }}
                size={18}
                className="mb-1 text-red-600/60 hover:text-red-600/50"
              />
            ) : (
              <FaTimesCircle
                onClick={() => setEditBodyPen(false)}
                size={18}
                className="text-red-600/60 hover:text-red-600/50"
              />
            )
          ) : (
            <FaRegEdit
              title="Edit the body"
              size={18}
              onClick={() => setEditBodyPen((prev) => !prev)}
              className={`text-red-600 hover:text-red-600/80 inline ml-1 ${
                editBodyPen && "-mt-6"
              }`}
            />
          ))}
      </div>
      <div className="flex items-center justify-around">
        {/* Like */}
        <div className="flex items-center">
          {thumbsUp ? (
            <FaHeart
              className="cursor-pointer hover:text-blue-900"
              onClick={handleThumbsupClick}
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
                    isHome={isHome}
                    onInteractionUpdate={onInteractionUpdate}
                    optimComments={optimComments}
                    setCommentCount={setCommentCount}
                    setOptimComments={setOptimComments}
                    setUserOfInterest={setUserOfInterest}
                  />
                </Suspense>
              )}
            </div>
          )}

          {/* Comments count */}
          {!showCommentForm && (
            <p
              onClick={() => setShowComments((prev) => !prev)}
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
            onClick={() => setShowComments((prev) => !prev)}
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

BlogDetailView.propTypes = {
  blog: PropTypes.object,
  commentCount: PropTypes.number,
  commentRef: PropTypes.object,
  commentValue: PropTypes.string,
  dislikeCount: PropTypes.number,
  editBodyPen: PropTypes.bool,
  editBodyValue: PropTypes.string,
  expand: PropTypes.bool,
  handleRegThumbsDownClick: PropTypes.func,
  handleRegThumbsUpClick: PropTypes.func,
  handleSendComment: PropTypes.func,
  handleThumbsDownClick: PropTypes.func,
  handleThumbsupClick: PropTypes.func,
  isHome: PropTypes.bool,
  isSendingComment: PropTypes.bool,
  likeCount: PropTypes.number,
  onInteractionUpdate: PropTypes.func,
  optimComments: PropTypes.array,
  pTagRef: PropTypes.object,
  readyToUpdate: PropTypes.bool,
  setCommentCount: PropTypes.func,
  setCommentValue: PropTypes.func,
  setEditBodyPen: PropTypes.func,
  setEditBodyValue: PropTypes.func,
  setOptimComments: PropTypes.func,
  setShowComments: PropTypes.func,
  setUserOfInterest: PropTypes.func,
  showComments: PropTypes.bool,
  thumbsDown: PropTypes.bool,
  thumbsUp: PropTypes.bool,
  updateBtnRef: PropTypes.object,
};

export default memo(BlogDetailView);
