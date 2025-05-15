// store/restStore.ts
import { create } from "zustand";
import { scheduleLocalNotification } from "~/utils/notifications";
import * as Notifications from "expo-notifications";

interface RestState {
    isResting: boolean | null;
    restTime: number | null;
    key: number | null;
    notificationId: string | null;
    startRest: (restingTime: number) => void;
    endRest: () => void;
}

export const useRestStore = create<RestState>((set, get) => ({
    isResting: false,
    restTime: null,
    notificationId: null,
    key: 0,

    startRest: async (restingTime: number | null) => {
        console.log("startRest called");
        const { notificationId } = get();
        const isResting = get().isResting;
        let key = get().key;
        //Notification id before being inserted into the store
        let Id: string | null = null;

        //if a timer exists, update the key to reset the timer and handle the new notification
        if (isResting == true) {

            //if there is a notification already scheduled, cancel it
            if (notificationId) {
                console.log(
                    "Notification pre exists when creating new set, cancelling. Noitificationid:",
                    notificationId,
                );
                try {
                    await Notifications.cancelScheduledNotificationAsync(
                        notificationId,
                    );
                    console.log("Cancelled notification:", notificationId);
                } catch (error) {
                    console.error("Failed to cancel notification:", error);
                }

                //Create a new notification after erasing the old one
                Id = await scheduleLocalNotification({
                    title: "Rest Up!",
                    body: "Your rest time is up!",
                    triggerTime: Number(restingTime),
                });
                console.log("Notification id created after erasure:", Id);
            }

            set({ restTime: restingTime, key: key + 1, notificationId: Id });
            return;
        }

        //if no scheduled notification exists, create a new one
        console.log("No notification id, creating new one");
        Id = await scheduleLocalNotification({
            title: "Rest Up!",
            body: "Your rest time is up!",
            triggerTime: Number(restingTime),
        });
        console.log("Notification id created:", Id);

        // console.log("notificationId in restStore", notificationId);
        set({
            restTime: restingTime,
            isResting: true,
            notificationId: Id,
        });
    },

    endRest: async () => {
        const { notificationId } = get();
        console.log("endRest called");

        // MIGHT NEED TO MOVE THIS OUTSIDE, its bein uneccessarily called when the timer component ends
        if (notificationId) {
            try {
                await Notifications.cancelScheduledNotificationAsync(
                    notificationId,
                );
                console.log("Cancelled notification:", notificationId);
            } catch (error) {
                console.error("Failed to cancel notification:", error);
            }
        }

        set({
            isResting: false,
            notificationId: null,
        });
    },
}));
