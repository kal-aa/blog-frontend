import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

const ManageAccount = (props) => {
  const { formData, handleManageSubmit, manageError, providerId, setFormData } =
    props;
  const [preview, setPreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const fullNameRef = useRef(null);

  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const matched = formData.newPassword === formData.confirmPassword;

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
      className="flex flex-col max-w-xl gap-5 p-10 mt-5 rounded-md bg-stone-50 drop-shadow-2xl"
      onSubmit={(e) =>
        handleManageSubmit(
          e,
          fullNameRef,
          setIsDeleting,
          setIsUpdating,
          "update"
        )
      }
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
                : import.meta.env.VITE_PUBLIC_URL +
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

      <label
        htmlFor="name"
        ref={fullNameRef}
        className="manage-acc-label gap-x-[91px]"
      >
        <p>Full Name:</p>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          disabled={isDeleting || isUpdating}
          required
          className="manage-acc-input"
        />
      </label>

      {providerId === "password" && (
        <div>
          {changePassword ? (
            <div className="flex flex-col gap-5">
              <label
                htmlFor="newPassword"
                className="manage-acc-label gap-x-[63px]"
              >
                New Password:
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="New password"
                  disabled={isDeleting || isUpdating}
                  required
                  className="manage-acc-input"
                />
              </label>

              <label
                htmlFor="confirmPassword"
                className="manage-acc-label gap-x-10"
              >
                <div className="relative">
                  Confirm password:
                  <div className="absolute top-0 -right-5">
                    {matched && formData.newPassword?.length > 7 && (
                      <FaCheck className="inline mb-0.5" />
                    )}
                  </div>
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  disabled={isDeleting || isUpdating}
                  required
                  className="manage-acc-input"
                />
              </label>
            </div>
          ) : (
            <div className="md:flex md:justify-end">
              <button
                type="button"
                onClick={() => setChangePassword(true)}
                className="btn-style md:p-2"
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      )}
      <p className="max-w-xs mx-auto text-sm text-center text-red-500 break-words">
        {manageError}
      </p>

      <div className="flex flex-col items-center justify-center gap-3 md:flex-row-reverse">
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
          onClick={(e) =>
            handleManageSubmit(
              e,
              fullNameRef,
              setIsDeleting,
              setIsUpdating,
              "delete"
            )
          }
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

ManageAccount.propTypes = {
  formData: PropTypes.object.isRequired,
  handleManageSubmit: PropTypes.func.isRequired,
  manageError: PropTypes.string,
  providerId: PropTypes.string,
  setFormData: PropTypes.func,
};

export default ManageAccount;
