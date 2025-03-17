import { Stack } from "expo-router";
import { Button, View } from "react-native";
import { supabase } from "~/utils/supabase";


export default function Home() {
    return (
        <>
            <Button title="sign out" onPress={() => supabase.auth.signOut()}></Button>
            <Stack.Screen options={{ title: "Profile" }} />
        </>
    );
}

