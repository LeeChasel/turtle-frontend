import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { UploadButton } from "./UploadButton";

type VideoFactoryContainerProps = {
  factoryData: CustomizationDetail;
};

export function VideoFactoryContainer({
  factoryData,
}: VideoFactoryContainerProps) {
  console.log(factoryData);
  return (
    <>
      <div className="flex justify-end">
        <UploadButton hasVideo={false} />
      </div>
      <div>b</div>
    </>
  );
}
