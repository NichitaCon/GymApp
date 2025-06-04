import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    View,
    AppState,
    TextInput,
    Button,
    Pressable,
    Text,
} from "react-native";
import { Stack } from "expo-router";

import { supabase } from "../../utils/supabase";
import Header from "~/components/Header";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
    if (state === "active") {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

export default function Auth() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    return (
        <View className="flex-1 gap-3 p-5 pt-10 bg-white">
            <Stack.Screen
                options={{
                    title: "Log in",
                    header: () => <Header back={true} header={"Log in"} />,
                }}
            />

            {/* <Header header={"Log in"}/> */}

            {/* <Text className="text-4xl">Welcome to my app!</Text> */}
            <View className="gap-1">
                {/* <Text className="text-2xl">Email:</Text> */}
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Email"
                    placeholderTextColor="#c4c4c4"
                    autoCapitalize={"none"}
                    keyboardType="email-address"
                    className=" p-4 border-gray-300 border-2 rounded-md"
                />
            </View>

            <View>
                {/* <Text className="text-2xl">Password:</Text> */}
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor="#c4c4c4"
                    autoCapitalize={"none"}
                    className=" p-4 border-gray-300 border-2 rounded-md"
                />
            </View>

            <View className="flex-row gap-3">
                <Pressable
                    onPress={() => signInWithEmail()}
                    disabled={loading}
                    className="p-4 flex-1 bg-blue-300 rounded-md items-center"
                >
                    <Text className="font-bold text-gray-700 text-lg">
                        Log in
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
