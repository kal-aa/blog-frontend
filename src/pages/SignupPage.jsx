import { useNavigate } from "react-router-dom";
import Signup from "../components/SignUp";
import { useRef } from "react";

const SignupPage = () => {
  const navigate = useNavigate();
  const errRef = useRef(null);

  const signupSubmit = (formData, setError, setIsSigning) => {
    setIsSigning(true);

    const data = { ...formData };
    delete data.confirmPassword;

    const url = "http://localhost:5000/sign-up";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            setError(error.mssg);
            if (errRef.current) {
              clearTimeout(errRef.current);
            }
            errRef.current = setTimeout(() => {
              setError("");
            }, 5000);
            setTimeout(() => {
              setError("");
            }, 5000);
            throw new Error(error.mssg);
          });
        }

        return res.json();
      })
      .then((data) => {
        setIsSigning(false);
        navigate(`/home/${data.insertedId}`);
      })
      .catch((error) => {
        setIsSigning(false);
        console.error("Could not sign-up", error);
      });
  };

  return (
    <>
      <Signup signupSubmit={signupSubmit} />
    </>
  );
};

export default SignupPage;
