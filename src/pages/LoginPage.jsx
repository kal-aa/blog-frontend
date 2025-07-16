import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Login from "../components/Login";
import {
  logInWithEmail,
  signInWithGithub,
  signInWithGoogle,
} from "../config/auth";
import { handleOAuthSign } from "../utils/Oauth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const url = `${import.meta.env.VITE_BACKEND_URL}/auth/log-in`;

  const handleEmailLogin = async (formData, setError) => {
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
        console.error("Login failed with status:", res.status);
        const { mssg } = await res.json();
        setError(mssg || "Login failed");
        throw new Error(mssg);
      }

      const { id, name } = await res.json();
      setUser({ id, name });

      const trim = name.trim().split(" ")[0];
      const firstName = trim.charAt(0).toUpperCase() + trim.slice(1) || "User";

      navigate(`/home?loggerName=${firstName}`);
    } catch (error) {
      console.error("Could not log-in", error);
      setError(error.code || error.message || "An unexpected error occured");
    }
  };

  const handleGoogleSignIn = (setError) =>
    handleOAuthSign(
      "Log-in",
      signInWithGoogle,
      "Google",
      setError,
      navigate,
      url,
      setUser
    );

  const handleGithubSignIn = (setError) =>
    handleOAuthSign(
      "Log-in",
      signInWithGithub,
      "GitHub",
      setError,
      navigate,
      url,
      setUser
    );

  return (
    <Login
      emailLogin={handleEmailLogin}
      googleSignIn={handleGoogleSignIn}
      githubSignIn={handleGithubSignIn}
    />
  );
};

export default LoginPage;
