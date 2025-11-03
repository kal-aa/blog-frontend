import { FirebaseError } from "firebase/app";

export const errorMap: Record<string, string> = {
  "popup-closed-by-user": "The sign-in popup was closed before completing.",
  "network-request-failed":
    "Network error. Please check your internet connection.",
  "user-disabled": "This account has been disabled.",
  "account-exists-with-different-credential":
    "This email is already linked with another sign-in method.",
  "invalid-email": "The email address is not valid.",
};

export const getErrorMessage = (
  error: FirebaseError,
  fallBackMessage: string
): string => {
  const code = error.code?.split("/")[1] ?? "";
  const message = errorMap[code] || error.message || fallBackMessage;
  return message;
};
