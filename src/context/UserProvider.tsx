import { useState, useEffect, ReactNode } from "react";
import { UserContext } from "./UserContext";
import { useLocation } from "react-router-dom";
import { UserType } from "../types";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [user, setUser] = useState<UserType>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
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
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
