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
import { getErrorMessage } from "../utils/firebaseAuthErrorMap";
import { setGlobalError } from "../features/errorSlice";
import { useDispatch } from "react-redux";

const SignupPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const url = `${import.meta.env.VITE_BACKEND_URL}/auth/sign-up`;

  const dispatch = useDispatch();

  const handleEmailSignup = async (formData) => {
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

      const message = getErrorMessage(
        error,
        "An unexpected error occured during sign-up"
      );
      dispatch(setGlobalError(message));
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await handleOAuthSign(
        "Sign-up",
        signInWithGoogle,
        "Google",
        navigate,
        url,
        setUser
      );
    } catch (error) {
      const message = getErrorMessage(
        error,
        "An unexpected error occured during GitHub sign-up"
      );
      dispatch(setGlobalError(message));
    }
  };

  const handleGithubSignup = async () => {
    try {
      await handleOAuthSign(
        "Sign-up",
        signInWithGithub,
        "GitHub",
        navigate,
        url,
        setUser
      );
    } catch (error) {
      const message = getErrorMessage(
        error,
        "An unexpected error occured during GitHub sign-up"
      );
      dispatch(setGlobalError(message));
    }
  };

  return (
    <Signup
      emailSignup={handleEmailSignup}
      githubSignup={handleGithubSignup}
      googleSignup={handleGoogleSignup}
    />
  );
};

export default SignupPage;
