import { lazy, memo, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import {
  FaCheckCircle,
  FaRegEdit,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { formatNumber } from "../utils/formatNumber";
import { relativeTime } from "../utils/relativeTime";
import SuspenseFallback from "./SuspenseFallback";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { setUserOfInterest } from "../features/blogSlice";
import { RootState } from "../store/store";
import { BlogCardProps } from "../types/blog";
import { invalidateBlogQueries } from "../utils/InvalidateBlogQueries";
const BlogDetail = lazy(() => import("./BlogDetail"));

function BlogCard({
  blog,
  handleDeleteBlog, // !isHome
  handleUpdateBlog, // !isHome
}: BlogCardProps) {
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [viewCount, setViewCount] = useState<number>(0);
  const [expand, setExpand] = useState(false);
  const navigate = useNavigate();
  //  for the YourtodosPage
  const [editTitleValue, setEditTitleValue] = useState(blog.title || "");
  const [editBodyValue, setEditBodyValue] = useState(blog.body || "");
  const originalTitleRef = useRef(blog.title || "");
  const originalBodyRef = useRef(blog.body || "");
  const [editTitlePen, setEditTitlePen] = useState(false);
  const [editBodyPen, setEditBodyPen] = useState(false);
  const [readyToUpdate, setReadyToUpdate] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateBtnRef = useRef<HTMLButtonElement>(null);
  const titleInpRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const id = user?.id;
  const isHome = useSelector((state: RootState) => state.blog.isHome);
  const dispatch = useDispatch();

  useEffect(() => {
    setViewCount(blog.views?.length ?? 0);
  }, [blog.views]);

  // for isHome = the like and dislike icons
  useEffect(() => {
    if (!id) return;
    setThumbsUp(blog.likes?.includes(id) ?? false);
    setThumbsDown(blog.dislikes?.includes(id) ?? false);
  }, [blog.likes, blog.dislikes, id]);

  // For !isHOme = check if it's valid to be updated,
  useEffect(() => {
    if (isHome) return;

    const trimmedTitle = editTitleValue.trim();
    const trimmedBody = editBodyValue.trim();

    const hasChanged = trimmedTitle !== blog.title || trimmedBody !== blog.body;
    const meetsLength = trimmedTitle.length >= 1 && trimmedBody.length >= 100;

    setReadyToUpdate(hasChanged && meetsLength);
  }, [blog.body, blog.title, editTitleValue, editBodyValue, isHome]);

  useEffect(() => {
    if (editTitlePen) {
      titleInpRef.current?.focus();
      titleInpRef.current?.select?.();
    }
  }, [editTitlePen]);

  const url = `${
    import.meta.env.VITE_BACKEND_URL
  }/interaction/${encodeURIComponent(blog._id)}`;

  //  increase view count
  const handleSeeMore = async () => {
    setExpand(true);

    if (!id) return;
    if (blog.views.includes(id)) return;

    setViewCount((prev) => prev + 1);

    try {
      await axios.patch(url, {
        action: "addView",
        userId: id,
      });

      invalidateBlogQueries(queryClient);
    } catch (error) {
      console.error("Error adding view:", error);
      setViewCount((prev) => prev - 1);
      blog.views = blog.views.filter((userId) => userId !== id);
    }
  };

  const blogDetailProps = {
    blog,
    editBodyPen,
    editBodyValue,
    expand,
    readyToUpdate,
    setEditBodyPen,
    setEditBodyValue,
    setThumbsDown,
    setThumbsUp,
    thumbsDown,
    thumbsUp,
    updateBtnRef,
  };

  return (
    <section className="blog-container">
      {/* profile pic */}
      {isHome && (
        <img
          src={
            blog.buffer && blog.mimetype
              ? `data:${blog.mimetype};base64,${blog.buffer}`
              : import.meta.env.VITE_PUBLIC_URL +
                "assets/images/unknown-user.jpg"
          }
          alt={`${blog.author ? blog.author.toUpperCase() : "user pic"}`}
          title={`more from ${blog.author?.toUpperCase()}`}
          onClick={() => {
            // navigate to the clicked user's blogs
            if (id !== blog.authorId) {
              dispatch(setUserOfInterest(blog.authorId));
            } else {
              navigate("/your-blogs");
            }
          }}
          className="absolute top-0 left-0 w-10 h-10 text-xs cursor-pointer rounded-br-2xl"
        />
      )}

      {/* Top right section */}
      <p className="date-style">{relativeTime(blog.createdAt)}</p>

      <div className="flex justify-between mx-3 ml-5">
        <div className="flex flex-col capitalize">
          {isHome && !expand && (
            <p className="text-xs capitalize md:text-sm">by: {blog.author}</p>
          )}
          <div className="space-x-1 w-[60%]">
            {!editTitlePen && (
              <h3 className="inline text-xl font-bold">
                {!expand && isHome
                  ? blog.title.slice(0, 5) + "..."
                  : blog.title}
              </h3>
            )}
            {editTitlePen && (
              <input
                ref={titleInpRef}
                value={editTitleValue}
                onChange={(e) => setEditTitleValue(e.target.value)}
                placeholder="Title"
                className="w-[80%] px-2 rounded-md outline-none ring-2 hover:rounded-lg focus:bg-gray-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && readyToUpdate) {
                    if (readyToUpdate) updateBtnRef.current?.click();
                  }
                }}
              />
            )}
            {!isHome &&
              (editTitlePen ? (
                readyToUpdate ? (
                  <FaCheckCircle
                    onClick={() => {
                      if (readyToUpdate) updateBtnRef.current?.click();
                    }}
                    size={18}
                    className="inline text-red-600/60 hover:text-red-600/50"
                  />
                ) : (
                  <FaTimesCircle
                    onClick={() => setEditTitlePen(false)}
                    size={18}
                    className="inline text-red-600/60 hover:text-red-600/50"
                  />
                )
              ) : (
                <FaRegEdit
                  title="Edit the title"
                  size={16}
                  onClick={() => setEditTitlePen((prev) => !prev)}
                  className="inline mb-1 text-red-600 hover:text-red-600/80"
                />
              ))}
          </div>
          {isHome ? (
            expand && (
              <p className="capitalize text-xs md:text-sm ml-1.5">
                by: {blog.author}
              </p>
            )
          ) : (
            <p className="text-sm">
              {formatNumber(viewCount)}
              {viewCount !== 1 ? " Views" : " View"}
            </p>
          )}
        </div>
      </div>

      {/* sample body */}
      <p className="mt-2 ml-3 leading-4 break-words">
        {isHome && !expand && blog.body.slice(0, 50) + "..."}
      </p>

      {/* Lazy loaded blog detail */}
      {isHome ? (
        expand && (
          <Suspense fallback={<SuspenseFallback />}>
            <BlogDetail {...blogDetailProps} />
          </Suspense>
        )
      ) : (
        <Suspense fallback={<SuspenseFallback />}>
          <BlogDetail {...blogDetailProps} />
        </Suspense>
      )}

      {/* See more and less */}
      {isHome && (
        <div className="mt-2">
          <span
            onClick={() => setExpand(false)}
            className="inline ml-3 text-blue-800 cursor-pointer hover:text-blue-600"
          >
            {expand && "Less"}
          </span>
          <span
            onClick={handleSeeMore}
            className="text-blue-800 cursor-pointer hover:text-blue-600"
          >
            {!expand && "See more"}
          </span>
          {expand ? (
            <MdExpandLess
              className="inline -mt-3 -mb-3 text-blue-800 cursor-pointer hover:text-blue-600"
              size={25}
              onClick={() => setExpand(false)}
            />
          ) : (
            <MdExpandMore
              className="inline text-blue-800 hover:text-blue-600 mb-0.5 cursor-pointer"
              size={25}
              onClick={handleSeeMore}
            />
          )}
          {!expand && formatNumber(viewCount)}
          {!expand && (
            <span className="ml-1 text-xs">
              {viewCount !== 1 ? " Views" : " View"}
            </span>
          )}
        </div>
      )}

      {/* Update and Delete btns, along with update Error */}
      {!isHome && (
        <div>
          <div className="flex justify-around mt-5">
            {/* update btn */}
            <button
              title={
                isUpdating
                  ? "updating..."
                  : readyToUpdate
                  ? "update blog"
                  : "no changes to update"
              }
              ref={updateBtnRef}
              onClick={() =>
                handleUpdateBlog?.({
                  blog,
                  editTitleValue,
                  editBodyValue,
                  originalBodyRef,
                  originalTitleRef,
                  setEditTitlePen,
                  setEditBodyPen,
                  setEditTitleValue,
                  setEditBodyValue,
                  setIsUpdating,
                })
              }
              disabled={!readyToUpdate || isUpdating}
              className={`text-white px-3 py-1 rounded-lg ${
                readyToUpdate ? "bg-gray-600 hover:bg-gray-800" : "bg-gray-400"
              }`}
            >
              {isUpdating ? (
                <span className="flex items-end">
                  update
                  <BeatLoader
                    size={8}
                    color="white"
                    className="w-5 mb-1 ml-1"
                  />
                </span>
              ) : (
                "Update"
              )}
            </button>
            {/* delete btn */}
            <button
              title={isDeleting ? "deleting..." : "delete blog"}
              onClick={() =>
                handleDeleteBlog?.({ blogId: blog._id, setIsDeleting })
              }
              disabled={isDeleting}
              className={`px-3 py-1 text-white bg-gray-600 rounded-lg hover:bg-gray-800`}
            >
              <span>Delete</span>
              <FaTrash
                size={12}
                className={`inline ml-1 hover:animate-pulse ${
                  isDeleting ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default memo(BlogCard);
