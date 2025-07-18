import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";
import { BarLoader, BeatLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";
import { auth, githubProvider, googleProvider } from "../config/firebase";
import {
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
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
  const [isAuthenticating, setisAuthenticating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [manageError, setManageError] = useState("");
  const navigate = useNavigate();
  const authInputRef = useRef(null);
  const [originalEmail, setOriginalEmail] = useState("");
  const queryClient = useQueryClient();
  const firebaseUser = auth.currentUser;
  const [providerId, setProviderId] = useState(null);
  const { user } = useUser();
  const id = user?.id;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const pid = firebaseUser.providerData[0]?.providerId;
        setProviderId(pid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (providerId?.includes("password")) {
      if (authError || authInputRef.current) {
        authInputRef.current.focus();
      }
    }
  }, [authError, providerId]);

  //  check the mini Authentication's password and fetch the data
  const handleAuthenticate = async (e) => {
    e.preventDefault();

    try {
      setisAuthenticating(true);
      setAuthError("");

      if (!firebaseUser || !firebaseUser.email) {
        throw new Error(
          "Session expired. Please Login again or Re-authenticate."
        );
      }

      if (providerId?.includes("password")) {
        if (authPassword.length < 8) {
          throw new Error("Must be greater than 8 characters");
        }

        const credential = EmailAuthProvider.credential(
          firebaseUser.email,
          authPassword
        );

        await reauthenticateWithCredential(firebaseUser, credential);
        setFormData((prev) => ({ ...prev, currentPassword: authPassword }));
      } else {
        let provider;

        if (providerId === "google.com") {
          provider = googleProvider;
        } else if (providerId === "github.com") {
          provider = githubProvider;
        } else {
          throw new Error("Unsupported provider. Please log in again.");
        }

        await reauthenticateWithPopup(firebaseUser, provider);
      }

      setIsAuthorized(true);

      const idToken = await firebaseUser.getIdToken();
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
      setisAuthenticating(false);

      // 3, show appropriate error messages on blog pages when the id from the context is not available

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

        toast.success("Account updated successfully!");
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
            className="p-10 bg-black/90 min-w-[400px] shadow-black drop-shadow-xl rounded-xl"
          >
            {providerId?.includes("password") && (
              <div>
                <label htmlFor="auth-password" className="flex text-white">
                  Password:
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
              </div>
            )}
            <p className="text-xs text-center text-red-400">{authError}</p>
            <button
              type="submit"
              disabled={isAuthenticating}
              className="manage-auth-btn"
            >
              <span>Autheticate</span>
              {isAuthenticating && (
                <BarLoader width={20} color="white" className="ml-0.5" />
              )}
            </button>
          </form>
        </div>
      )}
      {isAuthorized && (
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-2 mt-4">
              <BeatLoader />
              <p className="text-sm">Loading component...</p>
            </div>
          }
        >
          <ManageAccount
            formData={formData}
            handleManageSubmit={handleManageSubmit}
            isAuthenticating={isAuthenticating}
            manageError={manageError}
            providerId={providerId}
            setFormData={setFormData}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AccountPage;
