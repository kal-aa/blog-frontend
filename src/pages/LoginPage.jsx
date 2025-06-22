import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Login from "../components/Login";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const loginSubmit = async (formData, setError, setIsLogging) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/log-in`;

    setIsLogging(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        setError(error.mssg);
        throw new Error(error.mssg);
      }

      const { id, name } = await res.json();
      setUser({ id, name });

      const trim = name.trim().split(" ")[0];
      const firstName = trim.charAt(0).toUpperCase() + trim.slice(1) || "User";

      navigate(`/home/${id}?loggerName=${firstName}`);
    } catch (error) {
      console.error("Could not log-in", error);
      setError(error.message || "An unexpected error occured");
    } finally {
      setIsLogging(false);
    }
  };

  return <Login loginSubmit={loginSubmit} />;
};

export default LoginPage;
