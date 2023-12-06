import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={1500}
      pauseOnFocusLoss={false}
    />
  );
}
