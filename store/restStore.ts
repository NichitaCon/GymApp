// store/restStore.ts
import { create } from "zustand";

interface RestState {
    isResting: boolean | null;
    restTime: number | null;
    key: number | null;
    startRest: (restingTime: number) => void;
    endRest: () => void;
}

export const useRestStore = create<RestState>((set, get) => ({
    isResting: false,
    restTime: null,
    key: 0,

    startRest: (restingTime: number | null) => {
        console.log("startRest called");
        const isResting = get().isResting
        let key = get().key

        //if a timer exists, update the key to reset the timer
        if (isResting == true) {
            console.log("isrestingDEBUG", isResting)
            console.log(" key DEBUG", key)
            set({ restTime: restingTime });
            set({ key: key + 1});
            return
        }

        set({ restTime: restingTime });
        set({ isResting: true });
    },

    endRest: () => {
        set({ isResting: false });
        console.log("endRest called");
    }
}));

