import PropTypes from "prop-types";
import { useEffect } from "react";
import NoInternetConnection from "./NoInternetConnection";

const ConnectionMonitor = ({ isOnline, setIsOnline }) => {
  useEffect(() => {
    function updateOnlineStatus() {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [isOnline, setIsOnline]);
  return (
    <>
      {!isOnline && (
        <div className="mx-[25%] sm:mx-[30%] md:mx-[35%]">
          <NoInternetConnection />
        </div>
      )}
    </>
  );
};

ConnectionMonitor.propTypes = {
  isOnline: PropTypes.bool,
  setIsOnline: PropTypes.func,
};

export default ConnectionMonitor;
