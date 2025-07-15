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
import ConnectionMonitor from "../components/ConnectionMonitor";
import { useUser } from "../context/UserContext";

const HomePage = () => {
  const [limit, setLimit] = useState(0);
  const [userOfInterest, setUserOfInterest] = useState("");
  const hasShownLoginToast = useRef(false);
  const hasShownSignupToast = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isOnline = navigator.onLine;
  const { user } = useUser();
  const id = user?.id;

  useEffect(() => {
    const incomingUser = location.state?.userOfInterest;
    if (incomingUser) {
      setUserOfInterest(incomingUser);
    }
  }, [location.state]);

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
  } = useQuery({
    queryKey: ["all-blogs", { route: `blogs/${id}?page=${limit}` }],
    queryFn: fetchData,
    enabled: isObjectId(id),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const { blogsWithAuthors = [], totalPages = 0 } = blogData || {};

  const blogs = useMemo(() => {
    if (!blogsWithAuthors) return [];

    const filtered =
      userOfInterest === ""
        ? blogsWithAuthors
        : blogsWithAuthors.filter(
            (blog) => blog.authorId.toString() === userOfInterest
          );

    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [blogsWithAuthors, userOfInterest]);

  if (isError || !isObjectId(id)) {
    return <BlogFetchError refetch={refetch} isError={isError} />;
  }

  const authorName = blogs.length > 0 ? blogs[0].author : "";

  return (
    <div>
      <div className="px-[15%] sm:px-[20%] md:px-[25%] lg:px-[30%]">
        {!isOnline && <ConnectionMonitor />}
      </div>

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
            <NavLink
              onClick={() => setUserOfInterest("")}
              className="mx-1 text-blue-800 underline underline-offset-2 hover:text-blue-700"
            >
              back
            </NavLink>
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
                <BlogCard
                  blog={blog}
                  isHome={true}
                  setUserOfInterest={setUserOfInterest}
                />
              </div>
            ))}
          </section>
          {/* Link to go back to view all blogs when the user is viewing a single user's blog(s)*/}
          {userOfInterest && (
            <p
              onClick={() => {
                setUserOfInterest("");
              }}
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
