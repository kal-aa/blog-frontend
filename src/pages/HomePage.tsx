import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchBlogs";
import { isObjectId } from "../utils/isObjectId";
import BlogFetchError from "../components/BlogFetchError";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import { useUser } from "../context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { setIsHome, setUserOfInterest } from "../features/blogSlice";
import { setGlobalError } from "../features/errorSlice";
import { RootState } from "../store/store";
import { BlogsResponse } from "../types";

const HomePage = () => {
  const [limit, setLimit] = useState(0);
  const hasShownLoginToast = useRef(false);
  const hasShownSignupToast = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const id = user?.id;

  const dispatch = useDispatch();
  const { userOfInterest } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    dispatch(setIsHome(true));
  }, [dispatch]);

  // one-time-toast for login/signup welcome
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const loggerName = queryParams.get("loggerName");
    const signerName = queryParams.get("signerName");

    if (loggerName && !hasShownLoginToast.current) {
      toast(`Welcome back, ${loggerName}`);
      queryParams.delete("loggerName");
      navigate({ search: queryParams.toString() }, { replace: true });
      hasShownLoginToast.current = true;
    }

    if (signerName && !hasShownSignupToast.current) {
      toast(`Welcome, ${signerName}`);
      queryParams.delete("signerName");
      navigate({ search: queryParams.toString() }, { replace: true });
      hasShownSignupToast.current = true;
    }
  }, [location.search, navigate]);

  const {
    data: blogData,
    isFetching,
    isRefetching,
    isError,
    refetch,
  } = useQuery<
    BlogsResponse,
    Error,
    BlogsResponse,
    [string, { route: string }]
  >({
    queryKey: ["all-blogs", { route: `blogs/${id}?page=${limit}` }],
    queryFn: fetchData,
    enabled: !!id && isObjectId(id),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  const { blogsWithAuthors = [], totalPages = 0 } = blogData || {};

  const blogs = useMemo(() => {
    const filtered =
      userOfInterest === ""
        ? blogsWithAuthors
        : blogsWithAuthors.filter(
            (blog) => blog.authorId.toString() === userOfInterest
          );

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [blogsWithAuthors, userOfInterest]);

  useEffect(() => {
    if (!isFetching && (isError || !id || !isObjectId(id))) {
      dispatch(setGlobalError("Failed to fetch blogs."));
    }
  }, [dispatch, id, isError, isFetching]);

  if (isError || !id || !isObjectId(id)) {
    return <BlogFetchError refetch={refetch} isError={isError} />;
  }

  const authorName = blogs.length > 0 ? blogs[0].author : "";

  return (
    <div>
      {/* Check fetching and connection status and give response */}
      {isFetching && !isRefetching ? (
        <div className="flex flex-col justify-center items-center text-blue-800 min-h-[50vh]">
          <RingLoader color="darkBlue" size={100} speedMultiplier={1.5} />
          <p>please wait...</p>
        </div>
      ) : blogs.length === 0 ? (
        // check if no blogs are available
        userOfInterest ? (
          <p className="text-xl text-center">
            This user has no blogs yet, go
            <button
              onClick={() => dispatch(setUserOfInterest(""))}
              className="mx-1 text-blue-800 underline underline-offset-2 hover:text-blue-700"
            >
              back
            </button>
          </p>
        ) : (
          <p className="text-xl text-center">
            No Blogs Available yet, be the
            <NavLink
              to="/add-blog"
              className="mx-1 text-blue-800 underline underline-offset-2 hover:text-blue-700"
            >
              First
            </NavLink>
            One
          </p>
        )
      ) : (
        <div>
          {/* render blogs if available */}
          <section className="flex flex-col mx-[10%] sm:mx-[15%] md:mx-[20%] lg:mx-[25%] space-y-14 my-5">
            {userOfInterest && (
              <p className="text-lg text-center ">
                You&apos;re viewing {authorName}&apos;s Blog(s)
              </p>
            )}
            {blogs.map((blog) => (
              <div key={blog._id}>
                <BlogCard blog={blog} />
              </div>
            ))}
          </section>
          {/* Link to go back to view all blogs when the user is viewing a single user's blog(s)*/}
          {userOfInterest && (
            <p
              onClick={() => dispatch(setUserOfInterest(""))}
              className="mb-5 text-center cursor-pointer"
            >
              <span className="mr-1 font-bold text-blue-800 hover:text-blue-600">
                Go back
              </span>
              and view all
            </p>
          )}
          {/* Pagination */}
          <Pagination
            limit={limit}
            setLimit={setLimit}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
