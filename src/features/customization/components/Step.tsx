import stepImageUrl from "/customization_step.jpg?url";
import firstStepUrl from "/customization_step_start.jpg?url";

type StepProps = {
  label: string;
  onClick?: () => void;
  isFirst?: boolean;
};

export function Step({ label, onClick, isFirst }: StepProps) {
  const imageUrl = isFirst ? firstStepUrl : stepImageUrl;
  const Comp = onClick ? "button" : "span";

  return (
    <div className="relative flex items-center justify-center">
      <img
        src={imageUrl}
        alt="customization step"
        className="object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Comp className="text-white text-sm font-bold" onClick={onClick}>
          {label}
        </Comp>
      </div>
    </div>
  );
}
