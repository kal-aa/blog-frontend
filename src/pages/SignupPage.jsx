import { useNavigate } from "react-router-dom";
import Signup from "../components/Signup";

const SignupPage = () => {
  const navigate = useNavigate();

  const signupSubmit = async (formData, setError, setIsSigning) => {
    const { confirmPassword, image, ...submissionData } = formData;
    console.log(confirmPassword, "?.?.");

    const submissionDataWithFile = new FormData();
    Object.keys(submissionData).forEach((key) => {
      submissionDataWithFile.append(key, formData[key]);
    });

    if (image) {
      submissionDataWithFile.append("image", image);
    }

    setIsSigning(true);
    try {
      const url = "https://blog-backend-sandy-three.vercel.app/sign-up";
      const res = await fetch(url, {
        method: "POST",
        body: submissionDataWithFile,
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.mssg || "Signup failed");
      } else {
        const data = await res.json();
        setIsSigning(false);
        navigate(`/home/${data.insertedId}/?signupName=${data.firstName}`);
      }
    } catch (error) {
      console.error("An unexpected error occured", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSigning && setIsSigning(false);
    }
  };

  return <Signup signupSubmit={signupSubmit} />;
};

export default SignupPage;
