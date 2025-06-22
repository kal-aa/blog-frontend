import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export default function ConnectionMonitor({ focus = false }) {
  const btnRef = useRef(null);

  useEffect(() => {
    if (focus && btnRef.current) {
      btnRef.current.focus();
    }
  }, [focus]);

  return (
    <div className="flex flex-col items-center w-full pb-2 border-b-4 border-black rounded-full">
      <p className="font-bold">No internet connection</p>
      <button
        ref={btnRef}
        onClick={() => window.location.reload()}
        className="px-8 border border-black/30 focus:border rounded-2xl hover:bg-white/30"
      >
        Try again
      </button>
    </div>
  );
}

ConnectionMonitor.propTypes = {
  focus: PropTypes.bool,
};
