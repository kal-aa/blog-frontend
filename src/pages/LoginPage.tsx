import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Login from "../components/Login";
import {
  logInWithEmail,
  signInWithGithub,
  signInWithGoogle,
} from "../config/auth";
import { handleOAuthSign } from "../utils/Oauth";
import { setGlobalError } from "../features/errorSlice";
import { useDispatch } from "react-redux";
import { getErrorMessage } from "../utils/firebaseAuthErrorMap";
import { EmailLoginFormData } from "../types";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const dispatch = useDispatch();

  const url = `${import.meta.env.VITE_BACKEND_URL}/auth/log-in`;

  const handleEmailLogin = async (formData: EmailLoginFormData) => {
    try {
      const user = await logInWithEmail(formData.email, formData.password);
      const idToken = await user.getIdToken();

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        const { mssg } = await res.json();
        const message = mssg || "Login failed";

        console.error("Login failed with:", message);
        throw new Error(message);
      }

      const { id, name } = await res.json();
      setUser({ id, name });

      const trim = name.trim().split(" ")[0];
      const firstName = trim.charAt(0).toUpperCase() + trim.slice(1) || "User";

      navigate(`/home?loggerName=${firstName}`);
    } catch (error: any) {
      console.error("Could not log-in", error);

      const message =
        error.code || error.message || "An unexpected error occured";
      dispatch(setGlobalError(message));
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await handleOAuthSign(
        "Log-in",
        signInWithGoogle,
        "Google",
        navigate,
        url,
        setUser
      );
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        "An unexpected error occured during Google sign-in"
      );
      dispatch(setGlobalError(message));
    }
  };

  const handleGithubSignin = async () => {
    try {
      await handleOAuthSign(
        "Log-in",
        signInWithGithub,
        "GitHub",
        navigate,
        url,
        setUser
      );
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        "An unexpected error occured during GitHub sign-in"
      );
      dispatch(setGlobalError(message));
    }
  };

  return (
    <Login
      emailLogin={handleEmailLogin}
      googleSignin={handleGoogleSignin}
      githubSignin={handleGithubSignin}
    />
  );
};

export default LoginPage;
