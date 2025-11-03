import { auth, githubProvider, googleProvider } from "./firebase";
import {
  AuthProvider,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export async function signupWithEmail(email: string, password: string) {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Sign in error:", error.code, error.message);
    throw error;
  }
}

async function handleSignIn(provider: AuthProvider, providerName: string) {
  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    return user;
  } catch (error: any) {
    console.error(
      `${providerName} sign-in error:", ${error.code}, ${error.message}`
    );
    throw error;
  }
}

export const signInWithGoogle = () => handleSignIn(googleProvider, "Google");

export const signInWithGithub = () => handleSignIn(githubProvider, "Github");

export async function logInWithEmail(email: string, password: string) {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const methods = await fetchSignInMethodsForEmail(auth, cleanEmail);

    if (methods.length > 0 && !methods.includes("password")) {
      throw new Error(
        "No account found with this email, or it’s linked to Google or GitHub."
      );
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Login error:", error.code, error.message);
    throw error;
  }
}
