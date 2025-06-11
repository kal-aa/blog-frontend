import { FaEllipsisV } from "react-icons/fa";
import { NavLink, useMatch, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [elipsisClicked, setElipsisClicked] = useState(true);
  const navigate = useNavigate();
  const matchHome = useMatch("/home/:id");
  const matchAddBlog = useMatch("/add-blog/:id");
  const matchYourBlogs = useMatch("/your-blogs/:id");
  const matchUserInfo = useMatch("user/:id");
  const matchManageAccout = useMatch("/manage-your-acc/:id");
  const matchAboutUs = useMatch("/about-us/:id");
  const matchContactUs = useMatch("/contact-us/:id");

  const id =
    matchHome?.params.id ||
    matchAddBlog?.params.id ||
    matchYourBlogs?.params.id ||
    matchUserInfo?.params.id ||
    matchManageAccout?.params.id ||
    matchAboutUs?.params.id ||
    matchContactUs?.params.id ||
    undefined;

  const handleImgClick = () => {
    const confirm = window.confirm(
      "You are about to navigate to the signup page"
    );
    if (confirm) {
      navigate("/sign-up");
    }
  };

  const isActive = ({ isActive }) =>
    isActive
      ? "header-hover text-black hover:text-black bg-blue-300 py-1 px-2"
      : "header-hover py-1 px-2";

  return (
    <header className="header-container">
      {/* Lef section of the header */}
      <div className="flex items-center ml-1">
        <img
          onClick={handleImgClick}
          src={import.meta.env.VITE_PUBLIC_URL + "assets/images/blog.jpeg"}
          alt="blog.jpeg"
          className="w-16"
        />
        <FaEllipsisV
          onClick={() => {
            setElipsisClicked((prev) => !prev);
          }}
          className={
            elipsisClicked
              ? "h-5 mr-2 text-yellow-700 hover:text-yellow-600 sm:hidden"
              : "h-5 mr-2 text-yellow-700 hover:text-yellow-600 sm:hidden hover:"
          }
        />
        <div
          className={
            elipsisClicked
              ? "space-y-1 sm:flex sm:flex-row sm:space-x-4 sm:items-center sm:ml-2"
              : "space-y-1 sm:flex sm:flex-row sm:space-x-4 sm:items-center sm:ml-2 hidden"
          }
        >
          <div>
            <NavLink to={`/home/${id}`} className={isActive}>
              Home
            </NavLink>
          </div>
          <div>
            <NavLink to={`/add-blog/${id}`} className={isActive}>
              Add blog
            </NavLink>
          </div>
          <div>
            <NavLink to={`/your-blogs/${id}`} className={isActive}>
              Your blogs
            </NavLink>
          </div>
        </div>
      </div>

      {/* Right section of the header */}
      <div className="flex justify-center mr-2 space-y-1 text-center sm:flex sm:flex-col">
        <div className="hidden md:inline">
          <NavLink to={`/manage-your-acc/${id}`} className={isActive}>
            manage your acc
          </NavLink>
        </div>
        <div className="">
          <NavLink to={`/about-us/${id}`} className={isActive}>
            About us
          </NavLink>
        </div>
        <div className="">
          <NavLink to={`/contact-us/${id}`} className={isActive}>
            Contact us
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
