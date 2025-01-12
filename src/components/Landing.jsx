import { useState } from "react";
import { FaHeart, FaHeartBroken, FaRegEdit, FaRegHeart } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Landing = () => {
  const [thumbsUp, setThumbsUp] = useState(true);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(999);
  const [editTitlePen, setEditTitlePen] = useState(false);
  const [editBodyPen, setEditBodyPen] = useState(false);
  const [title, setTitle] = useState("Lorem");
  const [body, setBody] = useState(
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores in nostrum possimus vero eius totam deleniti a suscipit vel, voluptatibus molestiae velit aliquam distinctio, delectus nihil repudiandae architecto ipsam natus!"
  );

  const formatNumber = (x) => {
    if (x > 1_000_000_000) {
      return (x / 1_000_000_000).toFixed(1) + "B";
    } else if (x >= 1_000_000) {
      return (x / 1_000_000).toFixed(1) + "M";
    } else if (x >= 1_000) {
      return (x / 1_000).toFixed(1) + "K";
    }
    return x;
  };

  return (
    <section className="landingContainer">
      <div className="flex justify-between pt-8 mr-5 px-[5%] md:px-[15%] lg-[20%]">
        <img
          src={import.meta.env.VITE_PUBLIC_URL + "assets/images/blog.jpeg"}
          alt="Blog.jpeg"
          className="w-16 -mt-3"
        />
        <div className="space-x-5">
          <NavLink to="/log-in" className="btnStyle">
            Log in
          </NavLink>
          <NavLink to="/sign-up" className="btnStyle">
            Sign up
          </NavLink>
        </div>
      </div>

      <div className="px-[10%] md:px-[20%] lg-[25%]">
        <p className="bg-gradient-to-tr from-red-200 via-slate-400 to-stone-500 py-[8%] px-[10%] indent-1 font-bold text-sm rounded-[25%] md:text-base md:rounded-full">
          Welcome to BlogSphere, your go-to platform for sharing ideas, stories,
          and creativity with the world! Whether you&apos;re a seasoned writer
          or just getting started, our user-friendly tools make it easy to
          create, edit, and publish your content. Connect with a community of
          readers and writers, engage through comments and discussions, and
          explore a diverse range of topics. Start your blogging journey today
          and let your voice be heard!
        </p>

        <div className="relative pr-2 p-6 mt-10 bg-gray-400 rounded-2xl overflow-hidden">
          <img
            src={
              import.meta.env.VITE_PUBLIC_URL + "assets/images/unknown-user.jpg"
            }
            alt="user"
            className="absolute top-0 left-0 w-10 h-10 rounded-br-2xl"
          />

          <div className="flex justify-between ml-5 mx-3">
            <div className="flex flex-col capitalize">
              <p className="capitalize text-xs md:text-sm ml-0.5">
                by: Kalab Sisay
              </p>
              <div className="flex items-end space-x-1">
                {editTitlePen ? (
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-1/3 p-1 rounded-lg ring-2 focus:bg-slate-300"
                  />
                ) : (
                  <h3 className="text-xl font-bold">{title}</h3>
                )}
                <FaRegEdit
                  onClick={() => setEditTitlePen((prev) => !prev)}
                  size={13}
                  color="blue"
                  className="mb-1"
                />
              </div>
            </div>
            <p className="date-style">2 months ago</p>
          </div>

          {editBodyPen ? (
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Your blog description"
              className="inline w-3/4 p-2 mt-2 rounded-lg ring-4 focus:bg-slate-300"
            />
          ) : (
            <h3 className="inline ml-2 indent-1">{body}</h3>
          )}
          <FaRegEdit
            onClick={() => setEditBodyPen((prev) => !prev)}
            size={13}
            color="blue"
            className="inline mb-1 ml-1"
          />

          <div className="flex justify-around items-center">
            {/* Like */}
            <div className="flex items-center">
              {thumbsUp ? (
                <FaHeart
                  className="hover:text-blue-900 cursor-pointer"
                  onClick={() => setThumbsUp(false)}
                />
              ) : (
                <FaRegHeart
                  className="hover:text-blue-900 cursor-pointer"
                  onClick={() => {
                    if (thumbsDown) {
                      setThumbsDown(false);
                      setDislikeCount((prev) => prev - 1);
                    }
                    setThumbsUp(true);
                  }}
                />
              )}
              <p className="ml-2">{formatNumber(2_119_998)}</p>
            </div>

            {/* Dislike */}
            <div className="flex items-center">
              {thumbsDown ? (
                <FaHeartBroken
                  className="hover:text-blue-900 cursor-pointer"
                  onClick={() => {
                    setDislikeCount((prev) => prev - 1);
                    setThumbsDown(false);
                  }}
                />
              ) : (
                <FaHeartBroken
                  className="hover:stroke-blue-900 stroke-[45px] stroke-black fill-transparent cursor-pointer"
                  onClick={() => {
                    setThumbsUp(false);
                    setDislikeCount((prev) => prev + 1);
                    setThumbsDown(true);
                  }}
                />
              )}
              <p className="ml-2">{formatNumber(dislikeCount)}</p>
            </div>
          </div>

          {/* Comment form section */}
          <div className="flex flex-col items-center pt-5 md:pt-10 my-2 mx-[10%] bg-gray-400 rounded-xl">
            <form className="w-full flex justify-around">
              <input
                type="text"
                placeholder="comment"
                className="w-3/6 py-1 px-2 rounded-lg outline-none focus:ring-2 hover:ring-1 ring-white"
              />
              <NavLink
                to="/sign-up"
                type="submit"
                className="bg-black text-white px-4 rounded-lg hover:bg-gray-900"
              >
                post
              </NavLink>
            </form>
            <NavLink
              to="/sign-up"
              className="my-2 hover:underline underline-offset-2 cursor-pointer"
            >
              {formatNumber(2_222_999) + " Comments"}
            </NavLink>
          </div>
        </div>
      </div>

      <div className="text-center mt-16">
        <NavLink
          to="/sign-up"
          className="bg-red-500 text-white hover:bg-red-600 px-4 py-3 rounded-md"
        >
          Get Started
        </NavLink>
      </div>
    </section>
  );
};

export default Landing;
