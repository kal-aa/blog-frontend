import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const NotFound = () => {
  const { user } = useUser();
  const message = user?.id
    ? "Page Not Found"
    : "Page Not Found or Unauthorized";
  const description = user?.id
    ? "The page you are looking for doesn't exist or has been moved."
    : "The page you are looking for not found or needs authorization.";
  const homeLink = user?.id ? "/home" : "/";

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-6 text-xl text-gray-600">{message}</p>
      <p className="mb-8 text-gray-500 text-md">{description}</p>
      <Link
        to={homeLink}
        className="px-4 py-2 font-medium text-white transition bg-blue-600 rounded hover:bg-blue-700"
      >
        Go Back Home
      </Link>
      {!user?.id && (
        <div className="flex justify-center mt-2 space-x-[5%] w-full">
          <Link
            to="/log-in"
            className="px-4 py-2 font-medium underline transition-all duration-1000 hover:underline-offset-4"
          >
            Log in
          </Link>
          <Link
            to="/sign-up"
            className="px-4 py-2 font-medium underline transition-all duration-1000 hover:underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotFound;
