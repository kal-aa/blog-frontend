import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { AiOutlineCheck } from "react-icons/ai";
import PropTypes from "prop-types";
import IsOnline from "./IsOnline";

const AddBlog = ({ postBlog }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [passCheck, setPassCheck] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ title: "", body: "" });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
      return;
    } else if (!isOnline) {
      return;
    } else {
      setBodyError(false);
    }

    postBlog(formData, setIsPosting, setError);
  };

  return (
    <div className="signupContainer">
      {/* check whether user is online */}
      <IsOnline isOnline={isOnline} setIsOnline={setIsOnline} />

      {/* show Error */}
      <div className={error ? "errorStyle" : undefined}>
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
          type="submit"
          disabled={isPosting}
          className={`w-full rounded-md bg-black text-white py-2 mt-2 ${
            !isPosting && "hover:scale-95"
          } transition-all duration-200 ease-out`}
        >
          {isPosting ? (
            <div className="flex justify-center items-end">
              <span>post</span>
              <BeatLoader size={5} color="white" className="mb-1 w-5" />
            </div>
          ) : (
            "Post"
          )}
        </button>
      </form>
    </div>
  );
};

AddBlog.propTypes = {
  postBlog: PropTypes.func,
};

export default AddBlog;
