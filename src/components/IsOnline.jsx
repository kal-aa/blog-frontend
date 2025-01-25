import PropTypes from "prop-types";
import { useEffect } from "react";

const IsOnline = ({ isOnline, setIsOnline }) => {
  
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
        <div className="noConnection">
          <p>No internet connection</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white text-sm px-2 py-1 rounded-lg mt-[5%] hover:scale-y-105"
          >
            reload
          </button>
        </div>
      )}
    </>
  );
};

IsOnline.propTypes = {
  isOnline: PropTypes.bool,
  setIsOnline: PropTypes.func,
};

export default IsOnline;
