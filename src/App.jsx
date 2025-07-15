import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddBlogPage from "./pages/AddBlogPage";
import YourBlogsPage from "./pages/YourBlogsPage";
import ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./components/NotFound";
import { useUser } from "./context/UserContext";
import VerfyEmail from "./pages/VerfiyEmail";
import CompleteProfile from "./pages/CompleteProfile";

const App = () => {
  const location = useLocation();
  const { user } = useUser();

  const noFooterAndHeader = ["/", "/sign-up", "/log-in"];

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      {!noFooterAndHeader.includes(location.pathname) && user?.name && (
        <Header />
      )}

      {/* Routes */}
      <div className="flex-grow mt-28">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/log-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />

          {!user?.id ? (
            <>
              <Route path="/verify-email" element={<VerfyEmail />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
            </>
          ) : (
            <>
              <Route path="/home" element={<HomePage />} />
              <Route path="/add-blog" element={<AddBlogPage />} />
              <Route path="/your-blogs" element={<YourBlogsPage />} />
              <Route path="/manage-account" element={<AccountPage />} />
            </>
          )}
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!noFooterAndHeader.includes(location.pathname) && user?.name && (
        <Footer />
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
