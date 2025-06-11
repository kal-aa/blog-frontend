import { useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ReplyCard from "./ReplyCard";

function ReplyList(data) {
  const {
    isHome,
    optimComment,
    optimReplies,
    setOptimComments,
    setOptimReplies,
    setReplyCount,
    setUserOfInterest,
  } = data;

  // !isHome
  const handleDeleteReply = useCallback(
    async (optimReply, setIsDeletingReply) => {
      setIsDeletingReply(true);
      console.log(optimReply);

      setOptimReplies((prev) => prev.filter((r) => r._id !== optimReply._id));

      setReplyCount((prev) => prev - 1);

      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/interaction/${encodeURIComponent(optimReply._id)}`;

      try {
        await axios.patch(url, {
          action: "removeReply",
          userId: optimReply.replierId,
        });
        setOptimComments((prev) =>
          prev.map((c) =>
            c._id === optimComment._id
              ? {
                  ...c,
                  replies: c.replies.filter((r) => r._id !== optimReply._id),
                }
              : c
          )
        );
      } catch (error) {
        console.error("Error deleting comment", error);
        if (optimReply) {
          setOptimReplies((prev) =>
            [...prev, optimReply].sort(
              (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
            )
          );
          setReplyCount((prev) => prev + 1);
        }
      } finally {
        setIsDeletingReply(false);
      }
    },
    [setOptimComments, setOptimReplies, setReplyCount, optimComment]
  );

  return (
    <>
      {optimReplies.map((r) => (
        <ReplyCard
          key={r._id}
          handleDeleteReply={handleDeleteReply}
          isHome={isHome}
          optimReply={{ ...r, authorId: optimComment.authorId }}
          setUserOfInterest={setUserOfInterest}
        />
      ))}
    </>
  );
}

ReplyList.propTypes = {
  isHome: PropTypes.bool,
  optimComment: PropTypes.object,
  optimReplies: PropTypes.array,
  setOptimComments: PropTypes.func,
  setOptimReplies: PropTypes.func,
  setReplyCount: PropTypes.func,
  setUserOfInterest: PropTypes.func,
};

export default ReplyList;
