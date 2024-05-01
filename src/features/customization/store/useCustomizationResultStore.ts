import createSelectors from "@/lib/zustand";
import { CustomizationBrief } from "@/types/Customization/CustomizationBase";
import { create } from "zustand";
import { ImageFactoryDataStore } from "../imageFactory";

type State = {
  customizationResult: CustomizationBrief[];
  imageFactoryData: ImageFactoryDataStore[];
};

type Action = {
  /**
   * Add a new customization to the result, should be called when a customization step is completed
   * @param newCustomization The new customization to be added to the result
   */
  addCustomization: (newCustomization: State["customizationResult"][0]) => void;
  setImageFactory: (newImageFactoryData: ImageFactoryDataStore[]) => void;
  reset: () => void;
};

const initialState: State = {
  customizationResult: [],
  imageFactoryData: [],
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
  setImageFactory: (newImageFactoryData) => {
    set({ imageFactoryData: [...newImageFactoryData] });
  },
  reset: () => set(initialState),
}));

export default createSelectors(useCustomizationResultStore);
