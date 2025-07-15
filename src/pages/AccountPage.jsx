import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "../config/firebase";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useUser } from "../context/UserContext";
const ManageAccount = lazy(() => import("../components/ManageAccount"));

const AccountPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    image: null,
    removeImage: false,
  });
  const [data, setData] = useState({});
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [manageError, setManageError] = useState("");
  const navigate = useNavigate();
  const authInputRef = useRef(null);
  const [originalEmail, setOriginalEmail] = useState("");
  const queryClient = useQueryClient();
  const { user } = useUser();
  const id = user?.id;

  useEffect(() => {
    if (authError || authInputRef.current) {
      authInputRef.current.focus();
    }
  }, [authError]);

  //  check the mini Authentication's password and fetch the data
  const handleAuthenticate = async (e) => {
    e.preventDefault();

    if (authPassword.length < 8) {
      setAuthError("Must be greater than 8 characters");
      return;
    }

    try {
      setIsAuthenticating(true);
      setAuthError("");

      const user = auth.currentUser;

      if (!user || !user.email) {
        setAuthError("Session expired. Please log in again.");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, authPassword);

      await reauthenticateWithCredential(user, credential);
      setFormData((prev) => ({ ...prev, currentPassword: authPassword }));

      setIsAuthorized(true);

      const idToken = await user.getIdToken();
      const url = `${import.meta.env.VITE_BACKEND_URL}/account/data/${id}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const userData = await res.json();
      if (!res.ok) {
        setAuthError(userData.mssg);
        throw new Error(userData.mssg);
      }

      setData(userData);
    } catch (err) {
      console.error("Error during re-authentication or data fetch", err);
      const message = err.code || err.message || "Authentication failed";

      setAuthError(message);
    } finally {
      setIsAuthenticating(false);
      setAuthPassword("");
    }
  };

  //  fill the form with the data from db
  useEffect(() => {
    if (data && (data.name || data.email || data.buffer)) {
      const image =
        data.buffer && data.mimetype
          ? `data:${data.mimetype};base64,${data.buffer}`
          : "";
      setFormData((prev) => ({
        ...prev,
        name: data.name || "",
        email: data.email || "",
        image,
        removeImage: false,
      }));
      setOriginalEmail(data?.email || "Unkonwn email");
    }
  }, [data]);

  //  update and delete
  const handleManageSubmit = async (
    e,
    fullNameRef,
    setIsDeleting,
    setIsUpdating,
    actionType
  ) => {
    e.preventDefault();
    setManageError("");

    // Delete
    if (actionType === "delete") {
      const confirm = window.confirm(
        "Are you sure you want to delete your user data?"
      );

      if (!auth.currentUser) {
        setManageError("Your session has expired. Please log in again.");
        return;
      }

      if (confirm) {
        const url = `${import.meta.env.VITE_BACKEND_URL}/account/delete/${id}`;
        setIsDeleting(true);

        try {
          const res = await fetch(url, { method: "DELETE" });

          if (!res.ok) {
            const error = await res.json();
            setManageError(error.mssg);
            throw new Error(error.mssg);
          }

          await deleteUser(auth.currentUser);
          await auth.signOut();

          navigate("/");
        } catch (error) {
          console.error("Error deleting client", error);
        } finally {
          setIsDeleting(false);
        }
      }
    }

    // Update
    if (actionType === "update") {
      setIsUpdating(true);
      try {
        const user = auth.currentUser;

        // Re-authenticate if email/password is being changed
        if (formData.currentPassword && formData.email) {
          try {
            const credential = EmailAuthProvider.credential(
              originalEmail,
              formData.currentPassword
            );
            await reauthenticateWithCredential(user, credential);
          } catch (error) {
            console.error("Reauthentication failed:", error);
            setIsAuthorized(false);
            toast.warn(
              "Session expired or credentials changed. Please re-authenticate."
            );
            setFormData((prev) => ({
              ...prev,
              newPassword: "",
              confirmPassword: "",
            }));
            return;
          }
        }

        if (formData.newPassword) {
          if (formData.currentPassword === formData.newPassword) {
            setManageError(
              "New password must be different from the current password."
            );
            return;
          }
          if (formData.newPassword !== formData.confirmPassword) {
            setManageError("New password and confirmation do not match.");
            return;
          }
          await updatePassword(user, formData.newPassword);
          toast.success("Password updated successfully");
        }

        const checkFullName = formData.name.trim().split(" ");
        if (checkFullName.length !== 2) {
          setManageError("Please add your full name: 'John Doe'");
          fullNameRef.current.click();
          return;
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/account/update/${id}`;
        const updateData = {
          name: formData.name,
          removeImage: formData.removeImage,
        };

        const submissionDataWithFile = new FormData();
        Object.keys(updateData).forEach((key) => {
          submissionDataWithFile.append(key, updateData[key]);
        });

        if (formData.image instanceof File) {
          submissionDataWithFile.append("image", formData.image);
        }

        const res = await fetch(url, {
          method: "PATCH",
          body: submissionDataWithFile,
        });

        const data = await res.json();

        if (!res.ok) {
          setManageError(data.mssg);
          throw new Error(`Error updating client data ${data.mssg}`);
        }
        //  already up-to-date
        if (res.status === 200) {
          setIsUpdating(false);
          setManageError(data.mssg);
          return;
        }

        toast("Updated successfully!");
        queryClient.invalidateQueries(["all-blogs"]);
        navigate(`/home`);
      } catch (error) {
        console.error("Error updating client data", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* The mini authuntication card */}
      {!isAuthorized && (
        <div>
          <div className="absolute inset-0 -bottom-[105%] bg-gradient-to-br from-black/20 via-black/30 to-black/40 blur-3xl -top-28"></div>
          <form
            onSubmit={handleAuthenticate}
            className="p-10 bg-black/90 shadow-black drop-shadow-xl rounded-xl"
          >
            <label htmlFor="auth-password" className="flex text-white">
              Password:
              <p className="inline-block mt-1 ml-2 text-xs text-center text-red-400 max-w-60 md:max-w-80">
                {authError}
              </p>
            </label>
            <div className="relative group">
              <input
                ref={authInputRef}
                type="password"
                id="auth-password"
                name="auth-password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Your password"
                required
                disabled={isAuthenticating}
                className="input-style hover:border-blue-300"
              />
              <FaLock className="absolute top-3.5 md:top-4 left-2 group-hover:animate-pulse" />
            </div>
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full px-5 py-1 mt-2 text-center text-white bg-blue-900 rounded-lg hover:scale-105 disabled:hover:scale-100"
            >
              {isAuthenticating ? (
                <div className="flex items-end justify-center">
                  <span>go</span>
                  <BeatLoader size={5} color="white" className="ml-0.5" />
                </div>
              ) : (
                "Go"
              )}
            </button>
          </form>
        </div>
      )}
      {isAuthorized && (
        <Suspense fallback={<BeatLoader />}>
          <ManageAccount
            formData={formData}
            handleManageSubmit={handleManageSubmit}
            manageError={manageError}
            setFormData={setFormData}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AccountPage;
