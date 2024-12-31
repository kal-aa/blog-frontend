import { FaEllipsisV } from "react-icons/fa";
import { NavLink, useMatch } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [elipsisClicked, setElipsisClicked] = useState(true);
  const matchHome = useMatch("/home/:id");
  const matchAddBlog = useMatch("/add-blog/:id");
  const matchYourBlogs = useMatch("/your-blogs/:id");
  const matchManageAccout = useMatch("/manage-your-acc/:id");
  const matchAboutUs = useMatch("/about-us/:id");
  const matchContactUs = useMatch("/contact-us/:id");

  const id =
    matchHome?.params.id ||
    matchAddBlog?.params.id ||
    matchYourBlogs?.params.id ||
    matchManageAccout?.params.id ||
    matchAboutUs?.params.id ||
    matchContactUs?.params.id ||
    undefined;

  const isActive = ({ isActive }) =>
    isActive ? "header-hover text-black hover:text-black bg-blue-300 py-1 px-2" : "header-hover py-1 px-2";

  return (
    <>
      <header className="fixed bg-blue-900 text-slate-300 top-0 left-0 right-0 h-24 flex justify-around items-center text-sm md:text-base font-bold z-20">
        {/* Lef section of the header */}
        <div className="flex items-center ml-1">
          <img
            src={"/assets/images/blog.jpeg"}
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
        <div className="flex sm:flex sm:flex-col text-center justify-center space-y-1 mr-2">
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
    </>
  );
};

export default Header;
