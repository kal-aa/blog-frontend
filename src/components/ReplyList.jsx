import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import ReplyCard from "./ReplyCard";

function ReplyList(data) {
  const {
    isHome,
    optimComment,
    optimReplies,
    setOptimReplies,
    setReplyCount,
    setUserOfInterest,
  } = data;
  const queryClient = useQueryClient();

  // !isHome
  const handleDeleteReply = useCallback(
    async (optimReply, setIsDeletingReply) => {
      setIsDeletingReply(true);

      setOptimReplies((prev) => prev.filter((r) => r._id !== optimReply._id));
      setReplyCount((prev) => prev - 1);

      const url = `${import.meta.env.VITE_BACKEND_URL}/delete-reply/${
        optimReply._id
      }`;

      try {
        await fetch(url, {
          method: "DELETE",
        });

        queryClient.setQueryData(
          ["replies", { route: `comments/${optimComment._id}/replies` }],
          (old) => {
            if (!old) return old;
            return old.filter((r) => {
              console.log("old reply:", r);
              console.log("optim reply:", optimReply);

              return r._id !== optimReply._id;
            });
          }
        );
      } catch (error) {
        console.error("Error deleting reply", error);
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
    [setOptimReplies, setReplyCount, optimComment, queryClient]
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
  setOptimReplies: PropTypes.func,
  setReplyCount: PropTypes.func,
  setUserOfInterest: PropTypes.func,
};

export default ReplyList;
