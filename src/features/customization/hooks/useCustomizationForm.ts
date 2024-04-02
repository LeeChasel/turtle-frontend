import { ReactElement, useState } from "react";

export function useCustomizationForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const step = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  function next() {
    if (currentStepIndex >= steps.length - 1) return;
    setCurrentStepIndex(currentStepIndex + 1);
  }

  function previous() {
    if (currentStepIndex <= 0) return;
    setCurrentStepIndex(currentStepIndex - 1);
  }

  function goTo(index: number) {
    if (index < 0 || index >= steps.length) return;
    setCurrentStepIndex(index);
  }

  return {
    currentStepIndex,
    step,
    steps,
    isFirstStep,
    isLastStep,
    next,
    previous,
    goTo,
  };
}
