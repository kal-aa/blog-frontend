import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import { useRef } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const errRef = useRef(null);

  const loginSubmit = (formData, setError, setIsLogging) => {
    setIsLogging(true);
    const url = `https://blog-backend-sandy-three.vercel.app/log-in?email=${encodeURIComponent(
      formData.email
    )}&password=${encodeURIComponent(formData.password)}`;

    fetch(url)
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
            throw new Error(error.mssg);
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsLogging(false);
        navigate(`/home/${data.id}?loginName=${data.name}`);
      })
      .catch((error) => {
        setIsLogging(false);
        console.error("Could not log-in", error);
      });
  };

  return <Login loginSubmit={loginSubmit} />;
};

export default LoginPage;
