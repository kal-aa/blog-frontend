import { memo, useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { AiOutlineCheck } from "react-icons/ai";
import PropTypes from "prop-types";

const CreateBlogForm = ({ hanldeBlogPost }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [passCheck, setPassCheck] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ title: "", body: "" });
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (formData.body.replace(/\s+/g, " ").trim().length >= 100)
      setPassCheck(true);
    else setPassCheck(false);
  }, [formData]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBodyError(false);

    formData.body = formData.body.replace(/\s+/g, " ").trim();
    formData.title = formData.title.replace(/\s+/g, " ").trim();
    if (!passCheck) {
      setBodyError(true);
      return;
    }

    hanldeBlogPost(formData, setIsPosting, setError);
  };

  return (
    <div className="signup-container">
      {/* check whether user is online */}

      {/* show Error */}
      <div className={error ? "error-style" : undefined}>{error}</div>

      <h1 className="text-3xl font-bold">Share your ideas</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="title">Title:</label>
        <input
          ref={inputRef}
          type="title"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isPosting}
          placeholder="Your blog title"
          className="input-style bg-slate-100"
        />
        <label htmlFor="body">
          Body: {passCheck && <AiOutlineCheck className="inline mb-1" />}
          {bodyError && (
            <span className="ml-2 text-red-500">100 characters or more</span>
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
            disabled={isPosting}
            placeholder="Write a description for your blog (100 characters or more)"
            className="input-style bg-slate-100"
          />
        </div>
        <button
          type="submit"
          disabled={isPosting}
          className={`w-full rounded-md bg-black text-white py-2 mt-2 ${
            !isPosting && "hover:scale-95 disabled:hover:scale-100"
          } transition-all duration-200 ease-out`}
        >
          {isPosting ? (
            <div className="flex items-end justify-center">
              <span>post</span>
              <BeatLoader size={5} color="white" className="w-5 mb-1" />
            </div>
          ) : (
            "Post"
          )}
        </button>
      </form>
    </div>
  );
};

CreateBlogForm.propTypes = {
  hanldeBlogPost: PropTypes.func,
};

export default memo(CreateBlogForm);
