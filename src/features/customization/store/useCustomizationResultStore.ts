import createSelectors from "@/lib/zustand";
import {
  AudioBrief,
  CustomizationBrief,
} from "@/types/Customization/CustomizationBase";
import { create } from "zustand";

type State = {
  customizationResult: CustomizationBrief[];
  audioResult: AudioBrief[];
};

type Action = {
  /**
   * Add a new customization to the result, should be called when a customization step is completed
   * @param newCustomization The new customization to be added to the result
   */
  addCustomization: (newCustomization: State["customizationResult"][0]) => void;
  addAudio: (newCustomization: State["audioResult"][0]) => void;
  reset: () => void;
};

const initialState: State = {
  customizationResult: [],
  audioResult: [],
};

const useCustomizationResultStore = create<State & Action>((set, get) => ({
  ...initialState,
  addCustomization: (newCustomization) => {
    const customizationResult = get().customizationResult;
    const index = customizationResult.findIndex(
      (customization) => customization.name === newCustomization.name,
    );
    if (index !== -1) {
      const newCustomizationResult = [...customizationResult];
      newCustomizationResult[index] = newCustomization;
      set({ customizationResult: newCustomizationResult });
    } else {
      set({ customizationResult: [...customizationResult, newCustomization] });
    }
  },
  addAudio: (newCustomization) => {
    const customizationResult = get().audioResult;
    set({ audioResult: [...customizationResult, newCustomization] });
    /*const index = customizationResult.findIndex(
      (customization) => customization.name === newCustomization.name,
    );
    if (index !== -1) {
      const newCustomizationResult = [...customizationResult];
      newCustomizationResult[index] = newCustomization;
      set({ audioResult: newCustomizationResult });
    } else {
      set({ audioResult: [...customizationResult, newCustomization] });
    }*/
  },
  reset: () => set(initialState),
}));

export default createSelectors(useCustomizationResultStore);
