import { Button, Pressable, Text, View } from "react-native";
import { useAuth } from "~/contexts/AuthProvider";
import { useSessionStore } from "~/store/sessionStore";
import { useRestStore } from "~/store/restStore";

export function FinishButton() {
    const endRest = useRestStore((s) => s.endRest);
    const endSession = useSessionStore((s) => s.endSession);
    const sessionId = useSessionStore((state) => state.sessionId);
    const { user } = useAuth();

    if (sessionId) {
        return (
            <View className="flex-row justify-between items-center p-3">
                <Text className="text-green-500 text-2xl">
                    Workout session active
                </Text>
                <Pressable
                    onPress={() => {
                        endSession(user.id);
                        endRest();
                    }}
                >
                    <Text className="bg-blue-400 p-2 px-4 rounded-full text-center font-semibold text-xl">
                        Finish
                    </Text>
                </Pressable>
            </View>
        );
    }
}
