import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ReplyCard from "./ReplyCard";
import { handleDeleteReplyParams, Reply, ReplyListProps } from "../types/reply";
import { queryKeys } from "../utils/queryKeys";

function ReplyList({
  authorId,
  optimComment,
  optimReplies,
  setOptimReplies,
  setReplyCount,
}: ReplyListProps) {
  const queryClient = useQueryClient();

  // !isHome
  const handleDeleteReply = useCallback(
    async ({ optimReply, setIsDeletingReply }: handleDeleteReplyParams) => {
      setIsDeletingReply(true);

      setOptimReplies((prev) => prev.filter((r) => r._id !== optimReply._id));
      setReplyCount((prev) => prev - 1);

      const url = `${import.meta.env.VITE_BACKEND_URL}/delete-reply/${
        optimReply._id
      }`;

      try {
        const res = await fetch(url, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error(`Failed to delete reply: ${res.status}`);

        queryClient.setQueryData<Reply[]>(
          queryKeys.replies(optimComment._id),
          (old) => {
            if (!old) return old;
            return old.filter((r) => r._id !== optimReply._id);
          },
        );
      } catch (error) {
        console.error("Error deleting reply", error);
        setOptimReplies((prev) =>
          [...prev, optimReply].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        setReplyCount((prev) => prev + 1);
      } finally {
        setIsDeletingReply(false);
      }
    },
    [setOptimReplies, setReplyCount, optimComment, queryClient],
  );

  return (
    <>
      {optimReplies.map((r) => (
        <ReplyCard
          key={r._id}
          authorId={authorId}
          handleDeleteReply={handleDeleteReply}
          optimReply={r}
        />
      ))}
    </>
  );
}

export default ReplyList;
