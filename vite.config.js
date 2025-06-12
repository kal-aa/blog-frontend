import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    // base: env.VITE_PUBLIC_URL || "/",
    base: "/",
    publicDir: "public",
    server: { port: 5005 },
  };
});
