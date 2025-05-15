// utils/notifications.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as restStore from "~/store/restStore";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        alert("Must use physical device for Push Notifications");
        return;
    }

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
    }

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
        });
    }

    const token = (
        await Notifications.getExpoPushTokenAsync({
            projectId: Constants.easConfig?.projectId,
        })
    ).data;

    console.log("Expo Push Token:", token);
    return token;
}

export async function configureNotificationChannel() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default", // required for sound!
        vibrationPattern: [0, 500, 500, 500],
        lightColor: "#FF231F7C",
      });
    }
  }

export async function scheduleLocalNotification({
    title,
    body,
    triggerTime,
}: {
    title: string;
    body: string;
    triggerTime: number;
}) {
    // console.log(
    //     "Scheduling local notification with trigger time:",
    //     triggerTime,
    // );
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            sound: "default",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: triggerTime,
            repeats: false,
        },
    });
    // console.log("Notification scheduled with ID in notifications.ts:", notificationId);
    return notificationId;
}
