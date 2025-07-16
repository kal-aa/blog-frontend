export const handleOAuthSign = async (
  purpose,
  signFunction,
  providerName,
  setError,
  navigate,
  url,
  setUser
) => {
  try {
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
      throw new Error(mssg || `${providerName} ${purpose} failed`);
    }

    const { id, name } = data;
    setUser({ id, name });

    const trim = name.trim().split(" ")[0];
    const firstName = trim
      ? trim.charAt(0).toUpperCase() + trim.slice(1)
      : "User";

    navigate(
      `/home?${
        purpose === "Sign-up" ? "signerName" : "loggerName"
      }=${firstName}`
    );
  } catch (error) {
    setError(
      `${providerName} ${purpose} failed: ` +
        (error.code || error.message || "Something went wrong")
    );
  }
};
