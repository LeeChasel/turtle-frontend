import stepImageUrl from "/customization_step.jpg?url";
import firstStepUrl from "/customization_step_start.jpg?url";

type StepProps = {
  label: string;
  isFirst?: boolean;
};

// @TODO: use svg to replace static step image
export function Step({ label, isFirst }: StepProps) {
  const imageUrl = isFirst ? firstStepUrl : stepImageUrl;

  return (
    <div className="relative flex items-center justify-center">
      <img
        src={imageUrl}
        alt="customization step"
        className="object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-sm font-bold">{label}</span>
      </div>
    </div>
  );
}
