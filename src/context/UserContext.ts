import { createContext, useContext } from "react";
import { UserContextType } from "../types/auth";

export const UserContext = createContext<UserContextType>(null!);

export const useUser = () => useContext(UserContext);
