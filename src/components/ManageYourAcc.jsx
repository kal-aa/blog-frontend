import PropTypes from "prop-types";
import { useState } from "react";
import { FaCheck, FaLock, FaPlus } from "react-icons/fa";

const ManageYourAcc = ({
  formData,
  passwordProps,
  manageProps,
  isFullName,
  fullNameRef,
  handleImageUpload,
  data,
}) => {
  const [preview, setPreview] = useState("");

  const { password, setPassword, passwordError, isPasswordConfirmed } =
    passwordProps;
  const {
    isUpdating,
    isDeleting,
    badManageRequest,
    handleChange,
    handlePasswordSubmit,
    handleManageSubmit,
  } = manageProps;

  let matched;
  if (formData.password === formData.confirmPassword) {
    matched = true;
  } else {
    matched = false;
  }

  return (
    <div className="flex items-center justify-center relative">
      {/* The mini password authuntication form */}
      <form
        onSubmit={handlePasswordSubmit}
        className={isPasswordConfirmed ? "hidden" : " absolute z-10"}
      >
        <div className="bg-black p-10 shadow-black drop-shadow-xl rounded-xl -mt-32">
          <label htmlFor="password-confirm" className="text-white flex">
            Password:
            <p className="inline-block ml-2 mt-1 text-red-400 text-xs max-w-60 text-center md:max-w-80">
              {passwordError}
            </p>
          </label>
          <div className="relative">
            <input
              type="password"
              id="password-confirm"
              name="password-confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="inputStyle"
            />
            <FaLock className="absolute top-3.5 md:top-4 left-2" />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-900 text-white px-5 py-1 mt-2 rounded-lg hover:scale-105"
            >
              Go
            </button>
          </div>
        </div>
      </form>

      {/* update || delete form */}
      <form
        onSubmit={handleManageSubmit}
        className={
          isPasswordConfirmed
            ? "mt-5 max-w-xl signup-form bg-stone-50 p-10 rounded-md drop-shadow-2xl"
            : "mt-5 max-w-xl signup-form bg-stone-50 p-10 rounded-md drop-shadow-2xl filter blur-sm"
        }
      >
        <fieldset disabled={!isPasswordConfirmed}>
          <p className="text-red-600 max-w-60 break-words text-center leading-4 mb-2 md:max-w-80 md:px-2 md:ml-10">
            {badManageRequest || "\u00A0"}
          </p>
          <div className="flex justify-center items-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput"
              onChange={(e) => handleImageUpload(e, setPreview)}
            />
            <label
              htmlFor="fileInput"
              className="relative cursor-pointer"
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
                className="w-16 h-16 mb-2 rounded-lg"
              />
              {!preview && !data.buffer && (
                <FaPlus className="absolute bottom-2 opacity-3 text-6xl opacity-25 text-white" />
              )}
            </label>
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
              required
              className="manage-acc-input md:ml-[76px]"
            />
          </div>
          {isFullName ? (
            ""
          ) : (
            <p className="ml-2 md:ml-[152px] text-xs text-red-600">
              Please add your full name: &apos;John Doe&apos;
            </p>
          )}
          <div>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              required
              className={`manage-acc-input md:-ml-[1px] ${
                !matched && "md:ml-[19px]"
              }`}
            />
          </div>
          <p className="text-xs text-red-500 md:ml-[148px]">
            {passwordError || "\u00A0"}
          </p>
          <div className=" flex flex-col items-center justify-center space-y-3 md:flex-row-reverse md:space-y-0">
            <button
              type="submit"
              name="update"
              className="manage-acc-btn"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
            <button
              type="submit"
              name="delete"
              className="manage-acc-btn md:mr-5"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

ManageYourAcc.propTypes = {
  formData: PropTypes.object.isRequired,
  passwordProps: PropTypes.shape({
    password: PropTypes.string,
    setPassword: PropTypes.func,
    reEnteredPassword: PropTypes.string,
    setReEnteredPassword: PropTypes.func,
    passwordError: PropTypes.string,
    isPasswordConfirmed: PropTypes.bool.isRequired,
  }).isRequired,
  manageProps: PropTypes.shape({
    isUpdating: PropTypes.bool.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    badManageRequest: PropTypes.string,
    handleChange: PropTypes.func,
    handlePasswordSubmit: PropTypes.func,
    handleManageSubmit: PropTypes.func,
  }).isRequired,
  isFullName: PropTypes.bool.isRequired,
  fullNameRef: PropTypes.any,
  handleImageUpload: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default ManageYourAcc;
