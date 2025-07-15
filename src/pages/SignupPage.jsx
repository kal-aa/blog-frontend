import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Signup from "../components/Signup";
import {
  signInWithGithub,
  signInWithGoogle,
  signupWithEmail,
} from "../config/auth";
import { sendEmailVerification } from "firebase/auth";
import { handleOAuthSign } from "../utils/Oauth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const url = `${import.meta.env.VITE_BACKEND_URL}/auth/sign-up`;

  const handleEmailSignup = async (formData, setError) => {
    // eslint-disable-next-line no-unused-vars
    const { image, email, password, ...submissionData } = formData;
    const userData = new FormData();
    userData.append("image", image);

    try {
      const user = await signupWithEmail(email, password);

      await sendEmailVerification(user);

      navigate("/verify-email");
    } catch (error) {
      console.error("Could not Sign-up", error);
      setError(error.code || error.message || "An unexpected error occured");
    }
  };

  const handleGoogleSignup = (setError) =>
    handleOAuthSign(
      "Sign-up",
      signInWithGoogle,
      "Google",
      setError,
      navigate,
      url,
      setUser
    );

  const handleGithubSignup = (setError) =>
    handleOAuthSign(
      "Sign-up",
      signInWithGithub,
      "GitHub",
      setError,
      navigate,
      url,
      setUser
    );

  return (
    <Signup
      emailSignup={handleEmailSignup}
      githubSignup={handleGithubSignup}
      googleSignup={handleGoogleSignup}
    />
  );
};

export default SignupPage;
