// store/restStore.ts
import { create } from "zustand";

interface RestState {
    isResting: boolean | null;
    restTime: number | null;
    startRest: (restingTime: number) => void;
    endRest: () => void;
}

export const useRestStore = create<RestState>((set) => ({
    isResting: false,
    restTime: null,

    startRest: (restingTime: number | null) => {
        set({ isResting: true });
        set({ restTime: restingTime });
        console.log("startRest called");
    },

    endRest: () => {
        set({ isResting: false });
        console.log("endRest called");
    }
}));

