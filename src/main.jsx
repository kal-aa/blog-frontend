import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  // <HashRouter basename={import.meta.env.VITE_PUBLIC_URL}>
  <BrowserRouter>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <App />
        </UserProvider>
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
  // </HashRouter>
);
