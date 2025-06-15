import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

const ManageYourAcc = (props) => {
  const {
    manageError,
    formData,
    handleChange,
    handleManageSubmit,
    setFormData,
  } = props;
  const [preview, setPreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fullNameRef = useRef(null);

  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, []);

  const matched = formData.password === formData.confirmPassword;

  // hanlde the input image
  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      removeImage: false,
      image,
    }));
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(
        import.meta.env.VITE_PUBLIC_URL + "assets/images/unknown-user.jpg"
      );
    }
  };

  return (
    <form
      onSubmit={(e) =>
        handleManageSubmit(e, fullNameRef, setIsDeleting, setIsUpdating)
      }
      className="max-w-xl p-10 mt-5 rounded-md bg-stone-50 drop-shadow-2xl"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileInput"
          onChange={handleImageUpload}
          disabled={isDeleting || isUpdating}
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer"
          title="Change Your Profile Picture"
        >
          <img
            src={
              preview
                ? preview
                : formData.image
                ? formData.image
                : // ? `data:${data.mimetype};base64,${data.buffer}`
                  import.meta.env.VITE_PUBLIC_URL +
                  "assets/images/unknown-user.jpg"
            }
            alt="user"
            className="w-16 h-16 rounded-lg"
          />
        </label>
        {formData.image && (
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                image: null,
                removeImage: true,
              }));
              setPreview("");
            }}
            className="text-xs text-red-500 underline md:text-sm hover:text-red-700"
          >
            Remove Image
          </button>
        )}
      </div>
      <div>
        <label htmlFor="name" ref={fullNameRef}>
          Full Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          disabled={isDeleting || isUpdating}
          required
          className="manage-acc-input md:ml-[76px]"
        />
      </div>
      <div>
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email"
          disabled={isDeleting || isUpdating}
          required
          className="manage-acc-input md:ml-[100px]"
        />
      </div>
      <div className="relative">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Your password"
          disabled={isDeleting || isUpdating}
          required
          className="manage-acc-input md:ml-[80px]"
        />
      </div>
      <div className="relative">
        <label htmlFor="confirmPassword">
          Confirm password:{" "}
          {matched && formData.password.length > 7 && (
            <FaCheck className="inline mb-0.5" />
          )}{" "}
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          disabled={isDeleting || isUpdating}
          required
          className={`manage-acc-input md:-ml-[1px] ${
            !matched ? "md:ml-[19px]" : ""
          }`}
        />
      </div>

      <div className="relative flex flex-col items-center justify-center pt-8 space-y-3 md:flex-row-reverse md:space-y-0">
        <p className="absolute text-sm text-center text-red-500 top-0 bottom-[60%] text-wrap">
          {manageError || "\u00A0"}
        </p>
        <button
          type="submit"
          name="update"
          disabled={isUpdating}
          className="manage-acc-btn"
        >
          {isUpdating ? (
            <div className="flex items-end justify-center gap-0.5">
              <span>update</span>
              <BeatLoader size={5} color="white" />
            </div>
          ) : (
            "Update"
          )}
        </button>
        <button
          type="submit"
          name="delete"
          className="manage-acc-btn md:mr-5"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="flex items-end justify-center gap-0.5">
              <span>delete</span>
              <BeatLoader size={5} color="white" />
            </div>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </form>
  );
};

ManageYourAcc.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleManageSubmit: PropTypes.func.isRequired,
  manageError: PropTypes.string,
  setFormData: PropTypes.func,
};

export default ManageYourAcc;
