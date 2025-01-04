import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineCheck } from "react-icons/ai";
import PropTypes from "prop-types";

const AddBlog = ({ postBlog }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [passCheck, setPassCheck] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ title: "", body: "" });

  useEffect(() => {
    if (formData.body.replace(/\s+/g, " ").trim().length >= 100) {
      setPassCheck(true);
    } else {
      setPassCheck(false);
    }
  }, [formData]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    formData.body = formData.body.replace(/\s+/g, " ").trim();
    formData.title = formData.title.replace(/\s+/g, " ").trim();
    if (formData.body.length < 100) {
      setBodyError(true);
    } else {
      setBodyError(false);
    }

    postBlog(formData, setIsPosting, setError);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen px-[10%] sm:px-[20%] md:px-[25%] lg:px-[30%] -mt-20">
        <div
          className={
            error &&
            "flex justify-center items-center text-center border-l-8 border-red-500 px-2 rounded-xl text-red-600 border w-full h-20"
          }
        >
          {error}
        </div>
        <h1 className="text-3xl font-bold">Share your ideas</h1>

        <form onSubmit={handleSubmit} className="w-full">
          <label htmlFor="title">Title:</label>
          <input
            type="title"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Your blog title"
            className="inputStyle bg-slate-100"
          />
          <label htmlFor="body">
            Body: {passCheck && <AiOutlineCheck className="inline mb-1" />}
            {bodyError && (
              <span className="text-red-500 ml-2">100 characters or more</span>
            )}
          </label>
          <div className="relative">
            <textarea
              rows="5"
              type="body"
              name="body"
              id="body"
              value={formData.body}
              onChange={handleChange}
              required
              placeholder="Write a description for your blog (100 characters or more)"
              className="inputStyle bg-slate-100"
            />
          </div>
          <button
            disabled={isPosting}
            className={`w-full rounded-md bg-black text-white py-2 mt-2 ${
              !isPosting && "hover:scale-95"
            } transition-all duration-200 ease-out`}
          >
            {isPosting ? "Post..." : "Post"}
            {isPosting && (
              <ClipLoader color="white" size={10} className="ml-1" />
            )}
          </button>
        </form>
      </div>
    </>
  );
};

AddBlog.propTypes = {
  postBlog: PropTypes.func,
};

export default AddBlog;
