import { View, Text, Pressable, Alert } from "react-native";
import { Link } from "expo-router";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { scheduleLocalNotification } from "~/utils/notifications";

import { useRestStore } from "~/store/restStore";

export default function RestTimer({}) {
    const { isResting, restTime, key, startRest, endRest } = useRestStore();

    const confirmSkip = () => {
        Alert.alert(
            "Skip Rest?",
            "Are you sure you want to skip the rest period?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Skip",
                    onPress: () => {
                        endRest();
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true },
        );
    };
    if (isResting) {
        // scheduleLocalNotification({title: "Rest Up!", body: "Your rest time is up!", triggerTime: Number(restTime)});
        return (
            <Pressable onPress={confirmSkip}>
                <CountdownCircleTimer
                    isPlaying
                    key={key}
                    duration={restTime ?? 9999}
                    // initialRemainingTime={remainingTime}
                    colors={"#5d9cff"} // Light blue
                    size={40}
                    strokeWidth={5}
                    onComplete={() => {
                        endRest();
                    }}
                >
                    {({ remainingTime }) => <Text>{remainingTime}</Text>}
                </CountdownCircleTimer>
            </Pressable>
        );
    }
}
