import createSelectors from "@/lib/zustand";
import { create } from "zustand";

type State = {
  orderId: string;
};

type Action = {
  setOrderId: (orderId: State["orderId"]) => void;
};

const useSelectedOrderStore = create<State & Action>((set) => ({
  orderId: "",
  setOrderId: (orderId) => set({ orderId }),
}));

export default createSelectors(useSelectedOrderStore);
