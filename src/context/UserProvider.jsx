import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { UserContext } from "./UserContext";
import { useLocation } from "react-router-dom";

export const UserProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const publicRoutes = ["/", "/log-in", "/sign-up"];
    if (publicRoutes.includes(location.pathname)) {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
