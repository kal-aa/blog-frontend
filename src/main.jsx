import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  // <HashRouter basename={import.meta.env.VITE_PUBLIC_URL}>
  <BrowserRouter>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </UserProvider>
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
  // </HashRouter>
);
