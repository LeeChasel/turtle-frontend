import useCustomizationResultStore from "@/features/customization/store/useCustomizationResultStore";
import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { useEffect, useRef } from "react";

type ImageCustomizationContainerProps = {
  customizationData: CustomizationDetail;
};

export function ImageCustomizationContainer({
  customizationData,
}: ImageCustomizationContainerProps) {
  const cleanupExecuted = useRef(false);
  const addCustomization = useCustomizationResultStore.use.addCustomization();

  useEffect(() => {
    return () => {
      if (!cleanupExecuted.current) {
        addCustomization({
          name: customizationData.name,
          type: customizationData.type,
          customization: {
            fileRequirePara: {
              fileIds: ["1", "2", "3"],
            },
            price: 100,
          },
        });
        cleanupExecuted.current = true;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <span>Image Customization</span>
      <div>{JSON.stringify(customizationData)}</div>
    </div>
  );
}
