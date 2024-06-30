import createSelectors from "@/lib/zustand";
import {
  AudioBrief,
  CustomizationBrief,
} from "@/types/Customization/CustomizationBase";
import { create } from "zustand";
import { ImageResult, VideoResult } from "../types";

type State = {
  customizationResult: CustomizationBrief[];
  audioResult: AudioBrief[];
  imageResult: ImageResult[];
  videoResult: VideoResult[],
};

// should be called when a customization step is completed
type Action = {
  addAudio: (newCustomization: State["audioResult"][0]) => void;
  addImage: (newCustomization: State["imageResult"][0]) => void;
  addVideo: (newCustomization: State["videoResult"][0]) => void;
  reset: () => void;
};

const initialState: State = {
  customizationResult: [],
  audioResult: [],
  imageResult: [],
  videoResult: [],
};

const useCustomizationResultStore = create<State & Action>((set, get) => ({
  ...initialState,
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
  addImage: (newCustomization) => {
    const storedResults = get().imageResult;

    const index = storedResults.findIndex(
      (result) => result.name === newCustomization.name,
    );
    if (index !== -1) {
      const newResults = [...storedResults];
      newResults[index] = newCustomization;
      set({ imageResult: newResults });
    } else {
      set({ imageResult: [...storedResults, newCustomization] });
    }
  },
  addVideo: (newCustomization) => {
    const storedResults = get().videoResult;

    const index = storedResults.findIndex(
      (result) => result.name === newCustomization.name,
    );
    if (index !== -1) {
      const newResults = [...storedResults];
      newResults[index] = newCustomization;
      set({ videoResult: newResults });
    } else {
      set({ videoResult: [...storedResults, newCustomization] });
    }
  },
  reset: () => set(initialState),
}));

export default createSelectors(useCustomizationResultStore);
