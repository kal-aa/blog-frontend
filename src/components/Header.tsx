import { FaEllipsisV } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { setUserOfInterest } from "../features/blogSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const [elipsisClicked, setElipsisClicked] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = ({ isActive }: { isActive: boolean }) =>
    `header-hover py-1 px-2 ${
      isActive ? "text-black hover:text-black bg-blue-300" : ""
    }`;

  return (
    <header className="header-container">
      {/* Lef section of the header */}
      <div className="flex items-center ml-1">
        <img
          onClick={() => {
            dispatch(setUserOfInterest(""));
            navigate("/blogs");
          }}
          title="Return to landing page"
          src={import.meta.env.VITE_PUBLIC_URL + "assets/images/blog.jpeg"}
          alt="blog.jpeg"
          className="w-16 cursor-pointer"
        />
        <FaEllipsisV
          onClick={() => {
            setElipsisClicked((prev) => !prev);
          }}
          className="h-5 mr-2 text-yellow-700 hover:text-yellow-600 sm:hidden"
        />
        <div
          className={`space-y-1 sm:flex sm:flex-row sm:space-x-4 sm:items-center sm:ml-2 ${
            !elipsisClicked ? "hidden" : ""
          }`}
        >
          {/* <div>
            <NavLink to="/blogs" className={isActive}>
              Home
            </NavLink>
          </div> */}
          <div>
            <NavLink to="/add-blog" className={isActive}>
              Add blog
            </NavLink>
          </div>
          <div>
            <NavLink to="/your-blogs" className={isActive}>
              Your blogs
            </NavLink>
          </div>
        </div>
      </div>

      {/* Right section of the header */}
      <div className="flex justify-center mr-2 space-y-1 text-center sm:flex sm:flex-col">
        <div className="hidden md:inline">
          <NavLink to="/manage-account" className={isActive}>
            manage your acc
          </NavLink>
        </div>
        <div>
          <NavLink to="/about-us" className={isActive}>
            About us
          </NavLink>
        </div>
        <div>
          <NavLink to="/contact-us" className={isActive}>
            Contact us
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
