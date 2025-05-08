import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import { useRestStore } from "~/store/restStore";

export default function RestTimer({}) {
    const { isResting, restTime, startRest, endRest } = useRestStore();
    if (isResting) {
        return (
            <CountdownCircleTimer
                isPlaying
                duration={restTime ?? 9999}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                size={40}
                strokeWidth={5}
                colorsTime={[7, 5, 2, 0]}
                onComplete={() => {
                    // console.log("timer complete");
                    endRest();
                }}
            >
                {({ remainingTime }) => <Text>{remainingTime}</Text>}
            </CountdownCircleTimer>
        );
    }
}
