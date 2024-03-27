import { showToast } from "@/utils/toastAlert";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomizationContainerState } from "../types";
import { CustomizationProvider } from "../context/CustomizationProvider";

export function CustomizationContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as CustomizationContainerState;
  const { product, variation, quantity, customization } = locationState;
  useEffect(() => {
    if (!customization || !product || !variation || !quantity) {
      showToast("error", "無法取得商品資訊，請重新選擇商品");
      navigate(-1);
    }
  }, [customization, product, quantity, variation, navigate]);

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
