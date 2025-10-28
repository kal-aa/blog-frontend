import { createContext, useContext } from "react";
import { UserContextType } from "../types";

export const UserContext = createContext<UserContextType>(null!);

export const useUser = () => useContext(UserContext);
