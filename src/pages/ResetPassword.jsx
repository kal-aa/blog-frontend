import { useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const location = useLocation();
  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState("");
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsResetting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      const toastId = toast.success("Reset link sent! Check your email.");
      setTimeout(() => {
        toast.update(toastId, {
          render: "Don't forget to check the spam folder.",
          type: "info",
          autoClose: 5000,
          isLoading: false,
        });
      }, 4000);
    } catch (error) {
      console.error("Error sending password reset link: ", error);
      setError("Error sending reset link.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="signup-container !min-h-[80vh]">
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <div className={error ? "error-style" : ""}>{error}</div>

      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="email">
          Email:
          <input
            ref={emailInputRef}
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="E.g. sadkalshayee@gmail.com"
            disabled={isResetting}
            className="input-style"
          />
        </label>

        <div className="flex justify-end">
          {isResetting ? (
            <span className="text-blue-800/70">Back to Log in</span>
          ) : (
            <Link
              to="/log-in"
              className="text-blue-800 cursor-pointer hover:text-blue-800/80"
            >
              Back to Log in
            </Link>
          )}
        </div>

        <button
          type="submit"
          disabled={isResetting}
          className="!w-full bg-black text-white disabled:bg-black/50 sign-btn mt-3"
        >
          <span>Send Reset Link</span>
          {isResetting && (
            <div>
              <ClipLoader color="white" size={10} className="ml-1" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
