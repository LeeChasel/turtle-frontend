import { showToast } from "@/utils/toastAlert";
import { Navigate, useLocation } from "react-router-dom";
import { CustomizationContainerState } from "../types";
import { CustomizationProvider } from "../context/CustomizationProvider";

export function CustomizationContainer() {
  const locationState = useLocation().state as CustomizationContainerState;
  if (!locationState) {
    showToast("error", "無法取得商品客製化資訊，請重新選擇商品");
    return <Navigate to="/" replace />;
  }

  return (
    <CustomizationProvider defaultCustomization={locationState}>
      {/* Use zustand to manage the state of the customization process */}
      {/* Use the context to pass the state to the customization components */}
      {/* Step Component */}
      {/* Different steps of customization components */}
      <div>Customization</div>
    </CustomizationProvider>
  );
}
