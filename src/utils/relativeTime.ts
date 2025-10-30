import { formatDistanceToNow } from "date-fns";

export const relativeTime = (x: string) => {
  const date = new Date(x);
  return isNaN(date.getTime())
    ? "Unknown time"
    : formatDistanceToNow(date, { addSuffix: true });
};
