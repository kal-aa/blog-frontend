import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function BlogFetchError({ refetch, isError }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center text-red-600 min-h-[50vh]">
      {isError ? (
        <>
          <p>Oops! Something went wrong while fetching blogs.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-500/80"
          >
            Retry
          </button>
        </>
      ) : (
        <>
          <p>We couldn’t find your account. Please log in again.</p>
          <button
            type="button"
            onClick={() => navigate("/log-in")}
            className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-500/80"
          >
            Log In
          </button>
        </>
      )}
    </div>
  );
}

BlogFetchError.propTypes = {
  refetch: PropTypes.func,
  isError: PropTypes.bool,
};
