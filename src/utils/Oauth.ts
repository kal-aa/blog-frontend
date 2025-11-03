import { NavigateFunction } from "react-router-dom";
import { User } from "firebase/auth";
import { UserType } from "../types/auth";

export const handleOAuthSign = async (
  purpose: string,
  signFunction: () => Promise<User>,
  providerName: string,
  navigate: NavigateFunction,
  url: string,
  setUser: (user: UserType) => void
) => {
  const user = await signFunction();
  const idToken = await user.getIdToken();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const { mssg } = data;
    throw new Error(
      `${providerName} ${purpose} failed: ` + (mssg || "Something went wrong")
    );
  }

  const { id, name } = data;
  setUser({ id, name });

  const trim = name.trim().split(" ")[0];
  const firstName = trim
    ? trim.charAt(0).toUpperCase() + trim.slice(1)
    : "User";

  navigate(
    `/home?${purpose === "Sign-up" ? "signerName" : "loggerName"}=${firstName}`
  );
};
