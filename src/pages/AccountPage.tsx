import { FormEvent, lazy, Suspense, useEffect, useRef, useState } from "react";
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
import { setGlobalError } from "../features/errorSlice";
import { useDispatch } from "react-redux";
import { getErrorMessage } from "../utils/firebaseAuthErrorMap";
import { AccountFormData, ManageSubmitParams, UserData } from "../types/auth";
import { invalidateBlogQueries } from "../utils/InvalidateBlogQueries";
const ManageAccount = lazy(() => import("../components/ManageAccount"));

const AccountPage = () => {
  const [formData, setFormData] = useState<AccountFormData>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    image: null,
    removeImage: false,
  });
  const [data, setData] = useState<UserData | null>(null);
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [manageError, setManageError] = useState("");
  const navigate = useNavigate();
  const authInputRef = useRef<HTMLInputElement>(null);
  const [originalEmail, setOriginalEmail] = useState("");
  const queryClient = useQueryClient();
  const firebaseUser = auth.currentUser;
  const [providerId, setProviderId] = useState<string | null>(null);
  const { user } = useUser();
  const id = user?.id;

  const dispatch = useDispatch();

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
    if (providerId && providerId.includes("password")) {
      authInputRef.current?.focus();
    }
  }, [providerId]);

  //  check the mini Authentication's password and fetch the data
  const handleAuthenticate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsAuthenticating(true);

      if (!firebaseUser || !firebaseUser.email) {
        const message =
          "Session expired. Please Login again or Re-authenticate.";
        dispatch(setGlobalError(message));
        return;
      }

      if (providerId && providerId.includes("password")) {
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
          const message = "Unsupported provider. Please log in again.";
          dispatch(setGlobalError(message));
          return;
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
        const message = userData.mssg || "failed to fetch user data";
        dispatch(setGlobalError(message));
        return;
      }

      setData(userData);
    } catch (err: any) {
      console.error("Error during re-authentication or data fetch", err);
      const message = getErrorMessage(err, "Authentication failed");
      dispatch(setGlobalError(message));
    } finally {
      setIsAuthenticating(false);
      setAuthPassword("");
    }
  };

  //  fill the form with the data from db
  useEffect(() => {
    const { name = "", email = "", buffer, mimetype } = data || {};
    if (data && (name || email || buffer)) {
      const image =
        buffer && mimetype ? `data:${mimetype};base64,${buffer}` : null;
      setFormData((prev) => ({
        ...prev,
        name: name || "",
        email: email || "",
        image,
        removeImage: false,
      }));
      setOriginalEmail(email || "Unknown email");
    }
  }, [data]);

  //  update and delete
  const handleManageSubmit = async ({
    e,
    fullNameRef,
    setIsDeleting,
    setIsUpdating,
    actionType,
  }: ManageSubmitParams) => {
    e?.preventDefault?.();
    setManageError("");

    // Delete
    if (actionType === "delete") {
      const confirm = window.confirm(
        "Are you sure you want to delete your user data?"
      );

      if (!auth.currentUser) {
        const message = "Your session has expired. Please log in again.";
        dispatch(setGlobalError(message));
        return;
      }

      if (confirm) {
        const url = `${import.meta.env.VITE_BACKEND_URL}/account/delete/${id}`;
        setIsDeleting(true);

        try {
          const res = await fetch(url, { method: "DELETE" });

          if (!res.ok) {
            const error = await res.json();
            const message = error.mssg || "Failed to delete account";

            dispatch(setGlobalError(message));
            return;
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
        if (!user) throw new Error("User not signed in");

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
          if (formData.newPassword !== formData.confirmPassword) {
            setManageError("New password and confirmation do not match.");
            return;
          }
          if (formData.currentPassword === formData.newPassword) {
            setManageError(
              "New password must be different from the current password."
            );
            return;
          }
          await updatePassword(user, formData.newPassword);
          toast.success("Password updated successfully");
        }

        const checkFullName = formData.name.trim().split(" ");
        if (checkFullName.length !== 2) {
          setManageError("Please add your full name: 'John Doe'");
          fullNameRef.current?.click();
          return;
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/account/update/${id}`;
        const updateData = {
          name: formData.name,
          removeImage: formData.removeImage,
        };

        const submissionDataWithFile = new FormData();
        Object.keys(updateData).forEach((key) => {
          const typedKey = key as keyof typeof updateData;
          submissionDataWithFile.append(typedKey, String(updateData[typedKey]));
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
          const message = data.mssg || "Failed to update account";
          dispatch(setGlobalError(message));
          return;
        }
        //  already up-to-date
        if (res.status === 200) {
          const message = data.mssg || "Account already up-to-date";

          toast.info(message);
          setIsUpdating(false);
          return;
        }

        toast.success("Account updated successfully!");
        invalidateBlogQueries(queryClient);
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
      {/* The mini authentication card */}
      {!isAuthorized && (
        <div>
          <div className="absolute inset-0 -bottom-[105%] bg-gradient-to-br from-black/20 via-black/30 to-black/40 blur-3xl -top-28"></div>
          <form
            onSubmit={handleAuthenticate}
            className="p-10 bg-black/90 min-w-[400px] shadow-black drop-shadow-xl rounded-xl"
          >
            {providerId && providerId.includes("password") && (
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
