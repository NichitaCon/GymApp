import { Button } from "react-native";
import { useAuth } from "~/contexts/AuthProvider";
import { useSessionStore } from "~/store/sessionStore";

export function FinishButton() {
    const endSession = useSessionStore((s) => s.endSession);
    const { user } = useAuth();

    return (
        <Button
            title="Finish Session"
            onPress={async () => {
                await endSession(user.id);
                // optional: navigate home, show toast, etc.
            }}
        />
    );
}
