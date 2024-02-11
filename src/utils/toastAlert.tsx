import { ToastOptions, toast } from "react-toastify";

type toastType = "success" | "error" | "warn" | "info";

export function showToast(
  type: toastType,
  message: string,
  options?: ToastOptions,
) {
  switch (type) {
    case "success":
      return toast.success(message, options);
    case "error":
      return toast.error(message, options);
    case "warn":
      return toast.warn(message, options);
    case "info":
      return toast.info(message, options);
  }
}
