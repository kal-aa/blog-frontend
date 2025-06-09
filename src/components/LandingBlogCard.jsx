import { NavLink, useNavigate } from "react-router-dom";
import { formatNumber } from "../utils/formatNumber";
import {
  FaCheck,
  FaHeart,
  FaHeartBroken,
  FaRegEdit,
  FaRegHeart,
} from "react-icons/fa";
import { useState } from "react";

function BlogPostCard() {
  const [thumbsUp, setThumbsUp] = useState(true);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(999);
  const [editTitlePen, setEditTitlePen] = useState(false);
  const [editBodyPen, setEditBodyPen] = useState(false);
  const [title, setTitle] = useState("Lorem");
  const [body, setBody] = useState(
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores in nostrum possimus vero eius totam deleniti a suscipit vel, voluptatibus molestiae velit aliquam distinctio, delectus nihil repudiandae architecto ipsam natus!"
  );
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/sign-up");
  };

  return (
    <div className="relative p-6 pr-2 mt-10 overflow-hidden bg-gray-400 rounded-2xl">
      <img
        src={import.meta.env.VITE_PUBLIC_URL + "assets/images/unknown-user.jpg"}
        alt="user"
        className="absolute top-0 left-0 w-10 h-10 rounded-br-2xl"
      />

      <div className="flex justify-between mx-3 ml-5">
        {/* Title */}
        <div className="flex flex-col capitalize">
          <p className="capitalize text-xs md:text-sm ml-0.5">
            by: Kalab Sisay
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEditTitlePen(false);
            }}
            className="flex items-end space-x-1"
          >
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

            {editTitlePen ? (
              <button type="submit">
                <FaCheck size={13} color="blue" className="mb-1" />
              </button>
            ) : (
              <FaRegEdit
                onClick={() => setEditTitlePen(true)}
                size={13}
                color="blue"
                className="mb-1 cursor-pointer"
              />
            )}
          </form>
        </div>

        <p className="date-style">A month ago</p>
      </div>

      {/* Body */}
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
      {editBodyPen ? (
        <FaCheck
          onClick={() => setEditBodyPen(false)}
          size={13}
          color="blue"
          className="inline mb-1 ml-1"
        />
      ) : (
        <FaRegEdit
          onClick={() => setEditBodyPen(true)}
          size={13}
          color="blue"
          className="inline mb-1 ml-1"
        />
      )}

      {/* Like, Dislike section */}
      <section className="flex items-center justify-around">
        {/* Like */}
        <div className="flex items-center">
          {thumbsUp ? (
            <FaHeart
              className="cursor-pointer hover:text-blue-900"
              onClick={() => setThumbsUp(false)}
            />
          ) : (
            <FaRegHeart
              className="cursor-pointer hover:text-blue-900"
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
              className="cursor-pointer hover:text-blue-900"
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
      </section>

      {/* Comment form section */}
      <section className="flex flex-col items-center pt-5 md:pt-10 my-2 mx-[10%] bg-gray-400 rounded-xl">
        <form onSubmit={handleSubmit} className="flex justify-around w-full">
          <input
            type="text"
            placeholder="comment"
            className="w-3/6 px-2 py-1 rounded-lg outline-none focus:ring-2 hover:ring-1 ring-white"
          />
          <button
            type="submit"
            className="px-4 text-white bg-black rounded-lg hover:bg-gray-900"
          >
            post
          </button>
        </form>
        <NavLink
          to="/sign-up"
          className="my-2 cursor-pointer hover:underline underline-offset-2"
        >
          {formatNumber(222_999) + " Comments"}
        </NavLink>
      </section>
    </div>
  );
}

export default BlogPostCard;
