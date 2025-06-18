import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, NavLink, useNavigate, useParams } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
// import ConnectionMonitor from "../components/ConnectionMonitor";
import { fetchData } from "../utils/fetchBlogs";
import { isObjectId } from "../utils/isObjectId";
import BlogFetchError from "../components/BlogFetchError";
import BlogCard from "../components/BlogCard";

const HomePage = () => {
  const [limit, setLimit] = useState(0);
  const [userOfInterest, setUserOfInterest] = useState("");
  // const [isOnline, setIsOnline] = useState(navigator.onLine);
  const hasShownLoginToast = useRef(false);
  const hasShownSignupToast = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

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
    // && isOnline,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const blogs = useMemo(() => {
    if (!blogData) return [];

    const filtered =
      userOfInterest === ""
        ? blogData.blogsWithAuthors
        : blogData.blogsWithAuthors.filter(
            (blog) => blog.authorId.toString() === userOfInterest
          );

    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [blogData, userOfInterest]);

  if (isError || !isObjectId(id)) {
    return <BlogFetchError refetch={refetch} isError={isError} />;
  }

  const totalPages = blogData?.totalPages ?? 0;
  const authorName = blogs.length > 0 ? blogs[0].author : "";

  return (
    <div>
      {/* <ConnectionMonitor isOnline={isOnline} setIsOnline={setIsOnline} /> */}

      {/* Check fetching and connection status and give response */}
      {isFetching && !isRefetching ? (
        <div className="flex flex-col justify-center items-center text-blue-800 min-h-[50vh]">
          <RingLoader color="darkBlue" size={100} speedMultiplier={1.5} />
          <p>please wait...</p>
        </div>
      ) : // isOnline &&
      blogs.length === 0 ? (
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
              to={`/add-blog/${id}`}
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
            {blogs.map((blog) => (
              <div key={blog._id}>
                {userOfInterest && (
                  <p className="mb-4 text-lg text-center">
                    You&apos;re viewing {authorName}&apos;s Blog(s)
                  </p>
                )}
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
          {/* {isOnline && ( */}
          <section className="flex justify-center space-x-[25%] md:space-x-[20%]">
            <FaArrowLeft
              aria-label="Previous page"
              title="Previous page"
              className={limit < 1 && "text-gray-300 pointer-events-none"}
              onClick={() => {
                if (limit > 0) {
                  setLimit((prev) => prev - 1);
                }
              }}
            />
            <p className="px-2 text-white rounded-full bg-slate-600">
              {limit < 0 ? 0 : limit}
            </p>
            <FaArrowRight
              aria-label="Next page"
              title="Next page"
              className={`${
                limit >= totalPages - 1 && "text-gray-300 pointer-events-none"
              }`}
              onClick={() => {
                if (limit < totalPages - 1) {
                  setLimit((prev) => prev + 1);
                }
              }}
            />
          </section>
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default HomePage;
