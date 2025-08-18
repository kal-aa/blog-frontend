import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { clearGlobalError } from "../features/errorSlice";

export default function GlobalErrorHandler() {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.globalError.message);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearGlobalError());
    }
  }, [errorMessage, dispatch]);

  return null;
}
