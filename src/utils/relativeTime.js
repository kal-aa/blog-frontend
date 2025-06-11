import { formatDistanceToNow } from "date-fns";

export const relativeTime = (x) => {
  const date = new Date(x);
  return formatDistanceToNow(date, { addSuffix: true });
};
