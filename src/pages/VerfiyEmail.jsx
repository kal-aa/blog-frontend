import { useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

function VerifyEmail() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      setMessage("No user session found. Redirecting to sign-up...");
      setTimeout(() => navigate("/sign-up"), 3000);
    }
  }, [user, loading, navigate]);

  const checkVerification = async () => {
    setChecking(true);
    await user.reload();
    if (user.emailVerified) {
      setMessage("Email verified! Redirecting...");
      navigate("/complete-profile");
    } else {
      setMessage(
        "Email not verified yet. Please check your inbox and spam folder."
      );
    }
    setChecking(false);
  };

  const resendVerification = async () => {
    setResending(true);
    try {
      await sendEmailVerification(user);
      setMessage(
        "Verification email resent. Check your inbox and spam folder!"
      );
    } catch {
      setMessage("Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 mt-12">
      <div className="max-w-md p-6 text-center shadow-lg bg-white/50 rounded-xl">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Verify Your Email
        </h2>
        <p className="mb-6 text-gray-600">
          We&apos;ve sent a verification email. Please confirm your email to
          continue.
          <br />
          <strong>
            If you don&apos;t see it, check your spam or junk folder.
          </strong>
        </p>

        {message && (
          <div className="px-4 py-2 mb-4 text-sm text-blue-700 bg-blue-100 rounded">
            {message}
          </div>
        )}

        <button
          onClick={checkVerification}
          disabled={checking || !user}
          className="w-full py-2 text-white transition bg-black rounded hover:bg-black/80 disabled:opacity-50 disabled:hover:bg-black"
        >
          {checking ? "Checking..." : "Check Verification"}
        </button>

        <button
          onClick={resendVerification}
          disabled={resending || !user}
          className="w-full py-2 mt-3 text-black transition border border-black rounded hover:bg-gray-200/50 disabled:opacity-50"
        >
          {resending ? "Resending..." : "Resend Verification Email"}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;
