import create from "zustand";

export type AppState = {
  interacted: boolean;
  setInteracted: (interacted: boolean) => void;
};

export const useAppState = create<AppState>((set) => {
  return {
    interacted: false,
    setInteracted(interacted) {
      set({ interacted });
    },
  };
});
