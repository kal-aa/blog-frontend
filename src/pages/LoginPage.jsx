import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

const LoginPage = () => {
  const navigate = useNavigate();

  const loginSubmit = (formData, setError, setIsLogging) => {
    setIsLogging(true);
    const url = `http://localhost:5000/log-in?email=${encodeURIComponent(
      formData.email
    )}&password=${encodeURIComponent(formData.password)}`;
    console.log(url);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            setError(error.mssg);
            throw new Error(error.mssg);
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsLogging(false);
        navigate(`/home/${data.id}`);
      })
      .catch((error) => {
        setIsLogging(false)
        console.error("Could not log-in", error);
      });
  };

  return (
    <>
      <Login loginSubmit={loginSubmit} />
    </>
  );
};

export default LoginPage;
