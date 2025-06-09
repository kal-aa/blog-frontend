import { useNavigate } from "react-router-dom";
import Signup from "../components/Signup";

const SignupPage = () => {
  const navigate = useNavigate();

  const signupSubmit = async (formData, setError, setIsSigning) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, image, ...submissionData } = formData;

    const submissionDataWithFile = new FormData();
    Object.keys(submissionData).forEach((key) => {
      submissionDataWithFile.append(key, formData[key]);
    });

    if (image) {
      submissionDataWithFile.append("image", image);
    }

    setIsSigning(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/sign-up`;
      const res = await fetch(url, {
        method: "POST",
        body: submissionDataWithFile,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.mssg || "Signup failed");
      } else {
        const data = await res.json();
        navigate(`/home/${data.insertedId}/?signupName=${data.firstName}`);
      }
    } catch (error) {
      console.error("An unexpected error occured", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSigning(false);
    }
  };

  return <Signup signupSubmit={signupSubmit} />;
};

export default SignupPage;
