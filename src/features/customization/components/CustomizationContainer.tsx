import { useLocation } from "react-router-dom";
import { orderBy } from "lodash";
import { Step } from "./Step";
import { showToast } from "@/utils/toastAlert";
import { CustomizationContainerState } from "../types";
import { CustomizationProvider } from "../context/CustomizationProvider";
import { CustomizationType } from "@/types/Customization/CustomizationBase";
import { useCustomizationForm } from "../hooks/useCustomizationForm";
import { FinishCustomization } from "./FinishCustomization";
import { useEffect } from "react";
import useCustomizationResultStore from "../store/useCustomizationResultStore";
import { ImageFactoryContainer } from "@/features/customization/imageFactory";
import WaveForm from "../audioFactory/components/WaveForm";

export function CustomizationContainer() {
  const locationState = useLocation().state as CustomizationContainerState;
  const resetCustomizationResult = useCustomizationResultStore.use.reset();

  // Reset the customization result when the component is unmounted
  useEffect(() => {
    return () => {
      resetCustomizationResult();
    };
  }, [resetCustomizationResult]);

  // If the location state is not available, show an error message
  if (!locationState) {
    showToast("error", "無法取得商品客製化資訊，請重新至商品頁面選擇商品");
    return (
      <div className="text-center mt-5">
        無法取得商品客製化資訊，請重新至商品頁面選擇商品
      </div>
    );
  }

  // Sort the customization options by required, so that the required options are shown first
  const sortedCustomizations = orderBy(
    locationState.customization,
    ["required"],
    ["desc"],
  );

  // Create customization step components based on the customization type, e.g. ColorStep, SizeStep, etc.
  const customizationStepElements = sortedCustomizations.map(
    (customization) => {
      switch (customization.type) {
        case CustomizationType.SIMPLEFILES:
          // image, audio, video, etc.
          switch (
            customization.customization.fileRequirePara.fileMimeTypes[0].split(
              "/",
            )[0]
          ) {
            case "image":
              return (
                <ImageFactoryContainer
                  factoryData={customization}
                  key={customization.name}
                />
              );
            case "audio":
              return <WaveForm />;
            case "video":
              return <div>影片客製化</div>;
            default:
              return <div>未知客製化檔案類型</div>;
          }
      }
    },
  );

  customizationStepElements.push(<FinishCustomization />);

  const {
    step,
    isFirstStep,
    isLastStep,
    currentStepIndex,
    goTo,
    previous,
    next,
  } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCustomizationForm(customizationStepElements);

  return (
    <CustomizationProvider defaultCustomization={locationState}>
      <div className="p-3 space-y-4">
        <div className="flex items-center">
          {sortedCustomizations.map((customization, index) => (
            <Step
              key={customization.name}
              label={`第${index + 1}步：${customization.name}`}
              isFirst={index === 0}
              onClick={() => goTo(index)}
            />
          ))}
          <Step
            label="完成客製化"
            onClick={() => goTo(sortedCustomizations.length)}
          />
        </div>

        {/* main customization */}
        <div className="border-2 border-gray-800 p-2 lg:p-6">{step}</div>

        {/* step actions */}
        <div className="flex flex-row gap-7 justify-end pr-6">
          {!isFirstStep && (
            <button className="btn btn-primary shadow" onClick={previous}>
              上一步
            </button>
          )}
          {!isLastStep && (
            <button className="btn btn-primary shadow" onClick={next}>
              下一步
            </button>
          )}
        </div>

        {/* explaination of the current step */}
        {!isLastStep && (
          <div className="border-2 border-gray-800">
            {
              sortedCustomizations[
                currentStepIndex
              ].customization.fileRequirePara.fileMimeTypes[0].split("/")[0]
            }
            客製化說明圖片
          </div>
        )}
      </div>
    </CustomizationProvider>
  );
}
