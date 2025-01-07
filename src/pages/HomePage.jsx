import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, NavLink, useNavigate, useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import Main from "../components/Main";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [isFetchingBlogs, setIsFetchingBlogs] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const [limit, setLimit] = useState(0);
  const [totalPages, setTotalPages] = useState(Number);
  const hasShownLoginToast = useRef(false);
  const hasShownSignupToast = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const loginName = queryParams.get("loginName");
  const signupName = queryParams.get("signupName");

  //  Welcome
  useEffect(() => {
    if (loginName && !hasShownLoginToast.current) {
      toast(`Welcome back, ${loginName}`);
      queryParams.delete("loginName");
      navigate({ search: queryParams.toString() }, { replace: true });
      hasShownLoginToast.current = true;
    }

    if (signupName && !hasShownSignupToast.current) {
      toast(`Welcome, ${signupName}`);
      queryParams.delete("signupName");
      navigate({ search: queryParams.toString() }, { replace: true });
      hasShownSignupToast.current = true;
    }
  }, [loginName, signupName, location.search, navigate, queryParams]);

  //  data
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsFetchingBlogs(true);
        const url = `http://localhost:5000/all-blogs/${id}?page=${limit}`;

        const beData = await fetch(url);

        const response = await beData.json();
        setTotalPages(response.totalPages);
        const dataArray = response.blogsWithAuthors;

        setIsFetchingBlogs(false);
        setData(dataArray);
      } catch (error) {
        setIsFetchingBlogs(false);
        console.log("Error fetching blogs", error);
      }
    }
    fetchBlogs();
  }, [id, trigger, limit]);

  return (
    <div>
      {isFetchingBlogs ? (
        <div className="flex flex-col justify-center items-center text-blue-800 min-h-[50vh]">
          <RingLoader color="darkBlue" size={100} speedMultiplier={1.5} />
          <p>please wait...</p>
        </div>
      ) : (
        data.length === 0 && (
          <p className="text-center text-xl">
            No Blogs Available, be the
            <NavLink
              to={`/add-blog/${id}`}
              className="underline underline-offset-2 text-blue-800 hover:text-blue-700 mx-1"
            >
              First
            </NavLink>
            One
          </p>
        )
      )}
      <div className="flex flex-col mx-[10%] sm:mx-[15%] md:mx-[20%] lg:mx-[25%] 2xl:mx-[30%] space-y-14 my-5">
        {data &&
          data.length > 0 &&
          data.map((blog) => (
            <Main
              key={blog._id}
              blog={blog}
              comments={blog.comments}
              setTrigger={setTrigger}
            />
          ))}
      </div>
      {data && data.length > 0 && (
        <div className="flex justify-center space-x-[25%] md:space-x-[20%]">
          <FaArrowLeft
            aria-label="Previous page"
            title="Previous page"
            className={limit < 1 && "text-gray-500 pointer-events-none"}
            onClick={() => {
              if (limit > 0) {
                setLimit((prev) => prev - 1);
              }
            }}
          />
          <p className="bg-slate-600 px-2 text-white rounded-full">
            {limit < 0 ? 0 : limit}
          </p>
          <FaArrowRight
            aria-label="Next page"
            title="Next page"
            className={`${
              limit >= totalPages - 1 && "text-gray-500 pointer-events-none"
            }`}
            onClick={() => {
              if (limit < totalPages - 1) {
                setLimit((prev) => prev + 1);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
