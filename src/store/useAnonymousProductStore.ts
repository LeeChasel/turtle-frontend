import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AnonymousProductStore = {
  productId: string;
  updateProductId: (productId: string) => void;
};

const useAnonymousProductStore = create<AnonymousProductStore>()(
  persist(
    (set) => ({
      productId: "",
      updateProductId: (productId) => set({ productId }),
    }),
    {
      name: "anonymous-product",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useAnonymousProductStore;
