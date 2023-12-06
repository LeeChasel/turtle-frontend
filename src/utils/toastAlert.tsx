import { toast } from "react-toastify";

type toastType = "success" | "error" | "warn" | "info";

export function showToast(type: toastType, message: string) {
  switch (type) {
    case "success":
      return toast.success(message);
    case "error":
      return toast.error(message);
    case "warn":
      return toast.warn(message);
    case "info":
      return toast.info(message);
  }
}
