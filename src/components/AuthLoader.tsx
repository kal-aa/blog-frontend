import { ClipLoader } from "react-spinners";
import { AuthLoaderProps } from "../types/auth";

export const AuthLoader = ({
  active,
  color = "black",
  size = 16,
}: AuthLoaderProps) => {
  if (!active) return null;
  return <ClipLoader size={size} color={color} className="inline ml-2" />;
};
