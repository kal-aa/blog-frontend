import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
const ManageAccount = lazy(() => import("../components/ManageAccount"));

const AccountPage = () => {
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });
  const [user, setUser] = useState({});
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [manageError, setManageError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  //  check the mini Authentication's password and fetch the data
  const handleAuthenticate = async (e) => {
    e.preventDefault();

    if (authPassword.length < 8) {
      setAuthError("Must be greater than 8 characters");
      return;
    }

    setIsAuthenticating(true);
    setAuthError("");

    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/account/authenticate/${id}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ password: authPassword }),
      });

      const userData = await res.json();
      if (!res.ok) {
        setAuthError(userData.mssg);
        throw new Error(userData.mssg);
      }

      setUser(userData);
      setIsAuthorized(true);
    } catch (err) {
      console.error("Error comparing password", err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  //  fill the form with the data from db
  useEffect(() => {
    if (user) {
      const image =
        user.buffer && user.mimetype
          ? `data:${user.mimetype};base64,${user.buffer}`
          : "";
      setFormdata({
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
        confirmPassword: user.password || "",
        image,
      });
    }
  }, [user]);

  //  update and delete
  const handleManageSubmit = async (
    e,
    fullNameRef,
    setIsDeleting,
    setIsUpdating
  ) => {
    e.preventDefault();
    setManageError("");

    const actionType = e.nativeEvent.submitter.name;

    // Delete
    if (actionType === "delete") {
      const confirm = window.confirm(
        "Are you sure you want to delete your user data?"
      );

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
      const checkFullName = formData.name.trim().split(" ");
      if (checkFullName.length !== 2) {
        setManageError("Please add your full name: 'John Doe'");
        fullNameRef.current.click();
        return;
      }

      if (formData.password.length < 8) {
        setManageError("Should be > 8 characters");
        return;
      } else if (formData.password !== formData.confirmPassword) {
        setManageError("password does not match");
        return;
      }

      setIsUpdating(true);

      const url = `${import.meta.env.VITE_BACKEND_URL}/account/update/${id}`;
      const updateData = {
        name: formData.name,
        email: formData.email,
        newPassword: formData.password,
        Oldpassword: authPassword,
      };

      const submissionDataWithFile = new FormData();
      Object.keys(updateData).map((key) => {
        submissionDataWithFile.append(key, updateData[key]);
      });

      if (
        formData.image !== `data:${user.mimetype};base64,${user.buffer}` &&
        formData.image !== ""
      ) {
        submissionDataWithFile.append("image", formData.image);
      }

      try {
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
        navigate(`/home/${id}`);
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
            <label htmlFor="password-confirm" className="flex text-white">
              Password:
              <p className="inline-block mt-1 ml-2 text-xs text-center text-red-400 max-w-60 md:max-w-80">
                {authError}
              </p>
            </label>
            <div className="relative group">
              <input
                type="password"
                id="password-confirm"
                name="password-confirm"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                className="input-style hover:border-blue-300"
              />
              <FaLock className="absolute top-3.5 md:top-4 left-2 group-hover:animate-pulse" />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isAuthenticating}
                className="px-5 py-1 mt-2 text-white bg-blue-900 rounded-lg hover:scale-105"
              >
                {isAuthenticating ? (
                  <div className="flex items-end">
                    <span>go</span>
                    <BeatLoader
                      size={5}
                      color="white"
                      className="w-4 mb-0.5 ml-0.5"
                    />
                  </div>
                ) : (
                  "Go"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {isAuthorized && (
        <Suspense fallback={<BeatLoader />}>
          <ManageAccount
            manageError={manageError}
            user={user}
            formData={formData}
            handleChange={handleChange}
            handleManageSubmit={handleManageSubmit}
            authError={authError}
            setFormdata={setFormdata}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AccountPage;
