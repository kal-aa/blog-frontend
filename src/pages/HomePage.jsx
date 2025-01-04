import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, NavLink, useNavigate, useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import Main from "../components/Main";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [isFetchingBlogs, setIsFetchingBlogs] = useState(true);
  const [trigger, setTrigger] = useState(false);
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

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsFetchingBlogs(true);
        const url = `http://localhost:5000/all-blogs/${id}`;

        const res = await fetch(url);
        const dataArray = await res.json();

        setIsFetchingBlogs(false);
        setData(dataArray);
      } catch (error) {
        setIsFetchingBlogs(false);
        console.log("Error fetching blogs", error);
      }
    }
    fetchBlogs();
  }, [id, trigger]);

  return (
    <>
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
        {data.length > 0 &&
          data.map((blog) => (
            <Main
              key={blog._id}
              blog={blog}
              setTrigger={setTrigger}
            />
          ))}
      </div>
    </>
  );
};

export default HomePage;
