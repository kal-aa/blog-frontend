import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { BarLoader, BeatLoader } from "react-spinners";
import { ManageAccountProps } from "../types/auth";

const ManageAccount = ({
  formData,
  handleManageSubmit,
  isAuthenticating,
  manageError,
  providerId,
  setFormData,
}: ManageAccountProps) => {
  const [preview, setPreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const fullNameRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    fullNameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (changePassword) {
      document
        .getElementById("newPassword")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [changePassword]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const matched = formData.newPassword === formData.confirmPassword;

  // hanlde the input image
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0] || null;
    setFormData((prevFormData) => ({
      ...prevFormData,
      removeImage: false,
      image,
    }));
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(
        import.meta.env.VITE_PUBLIC_URL + "assets/images/unknown-user.jpg"
      );
    }
  };

  const defaultImage = `${
    import.meta.env.VITE_PUBLIC_URL
  }assets/images/unknown-user.jpg`;

  const imageSrc =
    preview ||
    (typeof formData.image === "string" ? formData.image : defaultImage);

  return (
    <form
      className="flex flex-col max-w-xl gap-5 p-10 mt-5 rounded-md bg-stone-50 drop-shadow-2xl"
      onSubmit={(e) =>
        handleManageSubmit({
          e,
          fullNameRef,
          setIsDeleting,
          setIsUpdating,
          actionType: "update",
        })
      }
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {isAuthenticating && (
          <div className="flex flex-col items-center gap-2 text-sm">
            <BarLoader />
            <p>Fetching user data....</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileInput"
          onChange={handleImageUpload}
          disabled={isDeleting || isUpdating || isAuthenticating}
        />
        <label
          htmlFor="fileInput"
          className={isAuthenticating ? "" : "cursor-pointer"}
          title={
            isAuthenticating
              ? "Wait till data is fetched..."
              : "Change your Profile Picture"
          }
        >
          <img src={imageSrc} alt="user" className="w-16 h-16 rounded-lg" />
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
          disabled={isDeleting || isUpdating || isAuthenticating}
          required
          className="manage-acc-input"
        />
      </label>

      {providerId && providerId.includes("password") && (
        <div>
          {changePassword && (
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
                  disabled={isDeleting || isUpdating || isAuthenticating}
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
                  disabled={isDeleting || isUpdating || isAuthenticating}
                  required
                  className="manage-acc-input"
                />
              </label>
            </div>
          )}
          <div className="md:flex md:justify-end">
            <button
              type="button"
              disabled={isAuthenticating}
              onClick={() => {
                if (
                  changePassword &&
                  (formData.confirmPassword || formData.newPassword)
                ) {
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: "",
                    newPassword: "",
                  }));
                }
                setChangePassword((prev) => !prev);
              }}
              className={`btn-style md:p-2 ${changePassword ? "mt-1" : ""}`}
            >
              {changePassword ? "Cancel Password Change" : "Change Password"}
            </button>
          </div>
        </div>
      )}
      <p className="max-w-xs mx-auto text-sm text-center text-red-500 break-words">
        {manageError}
      </p>

      <div className="flex flex-col items-center justify-center gap-y-3 gap-x-5 md:flex-row-reverse">
        <button
          type="submit"
          name="update"
          disabled={isUpdating || isAuthenticating}
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
            handleManageSubmit({
              e,
              fullNameRef,
              setIsDeleting,
              setIsUpdating,
              actionType: "delete",
            })
          }
          name="delete"
          className="manage-acc-btn"
          disabled={isDeleting || isAuthenticating}
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

export default ManageAccount;
