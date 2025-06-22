import { formatDistanceToNow } from "date-fns";

export const relativeTime = (x) => {
  const date = new Date(x);
  return date instanceof Date && !isNaN(date)
    ? formatDistanceToNow(date, { addSuffix: true })
    : "Unknown time";
};
