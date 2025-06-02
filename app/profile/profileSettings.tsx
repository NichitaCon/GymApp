import { router, Stack } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Pressable, Text, TextInput, View } from "react-native";
import Header from "~/components/Header";
import { useAuth } from "~/contexts/AuthProvider";

import { supabase } from "~/utils/supabase";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [OTCcode, setOTCCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordMatchBool = password === confirmPassword;

    const [OTCsent, setOTCsent] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [role, setRole] = useState("");

    const { session } = useAuth();

    useEffect(() => {
        if (session) getProfile();
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error("No user on the session!");

            const { data, error, status } = await supabase
                .from("profiles")
                .select(`username, avatar_url, full_name, role`)
                .eq("id", session?.user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
                setFullName(data.full_name);
                setRole(data.role);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile({
        username,
        avatar_url,
        full_name,
    }: {
        username: string;
        avatar_url: string;
    }) {
        try {
            setLoading(true);
            if (!session?.user) throw new Error("No user on the session!");

            const updates = {
                id: session?.user.id,
                username,
                avatar_url,
                full_name,
                updated_at: new Date(),
            };

            const { error } = await supabase.from("profiles").upsert(updates);

            if (error) {
                throw error;
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const linkAccount = async () => {
        console.log("Linking account...");
        const { data: updateEmailData, error: updateEmailError } =
            await supabase.auth.updateUser({
                email: email,
            });

        if (updateEmailError) {
            console.error("Error linking account:", updateEmailError);
            Alert.alert("Error linking account", updateEmailError.message);
            return;
        }

        setOTCsent(true);
        Alert.alert(
            "Confirmation email sent",
            "Please check your email to confirm account creation!",
        );
    };

    const verifyEmailOtpAndSetPassword = async () => {
        console.log("Verifying OTC code...");
        const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: OTCcode, // The OTP entered by the user
            type: "email",
        });

        if (error) {
            console.error("Error verifying OTC code:", error);
            Alert.alert("Error verifying code", error.message);
            return;
        }

        const { data: updatePasswordData, error: updatePasswordError } =
            await supabase.auth.updateUser({
                password: password,
            });

        if (updatePasswordError) {
            console.error("Password update error:", updatePasswordError);
            Alert.alert("Password creation error, Please try again.");
            return;
        }

        Alert.alert("Account created successfully!");
    };

    return (
        <View className="flex-1 bg-white p-5 gap-3">
            <Stack.Screen
                options={{
                    title: "Settings",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                    header: () => (
                        <Header header="Settings" back={true} />
                        // Add extra buttons/components here if you want
                    ),
                }}
            />

            {role !== "Guest user" && (
                <View>
                    <Text className="text-3xl">Edit Account:</Text>
                    <Text className="text-xl">Email:</Text>
                    <TextInput
                        editable={false}
                        value={session.user.email}
                        placeholder="email"
                        autoCapitalize={"none"}
                        className="border p-3 border-gray-400 rounded-md text-gray-500"
                    />
                    <Text className="text-xl">Name:</Text>
                    <TextInput
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
                        placeholder="full name"
                        autoCapitalize={"none"}
                        className="border p-3 border-gray-400 rounded-md"
                    />
                </View>
            )}

            {/* <TextInput
                onChangeText={(text) => setUsername(text)}
                value={username}
                placeholder="username"
                autoCapitalize={"none"}
                className="border p-3 border-gray-400 rounded-md"
            /> */}

            <View className="flex-row justify-between">
                {role !== "Guest user" ? (
                    <View>
                        <Pressable
                            onPress={() => {
                                updateProfile({
                                    username,
                                    avatar_url: avatarUrl,
                                    full_name: fullName,
                                });
                                router.push({
                                    pathname: "/(tabs)/profile",
                                    params: {
                                        username: username,
                                        full_name: fullName,
                                        avatar_url: avatarUrl,
                                    },
                                });
                            }}
                            disabled={loading}
                            className="p-4  bg-blue-400 rounded-md items-center w-1/3"
                        >
                            <Text className="font-bold text-white text-lg">
                                Save
                            </Text>
                        </Pressable>
                        <Pressable
                            className="p-4  border-2 border-gray-400 rounded-md items-center w-1/3"
                            onPress={() => {
                                supabase.auth.signOut();
                                router.replace("/(auth)/login");
                            }}
                        >
                            <Text className="font-bold text-black text-lg">
                                Sign out
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <View className="w-full flex-1">
                        <Text className="text-3xl">You are a guest user!</Text>
                        <Text className="mb-4">
                            Please create an account to sign out and save your
                            progress
                        </Text>

                        <View className="gap-2">
                            <TextInput
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                                placeholder="Email"
                                placeholderTextColor="#c4c4c4"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                                textContentType="emailAddress"
                                className=" p-4 border-gray-300 border-2 rounded-md"
                            />
                            <TextInput
                                onChangeText={(text) => setPassword(text)}
                                value={password}
                                secureTextEntry={true}
                                placeholder="Password"
                                placeholderTextColor="#c4c4c4"
                                autoCapitalize="none"
                                className=" p-4 border-gray-300 border-2 rounded-md"
                            />
                            <TextInput
                                onChangeText={(text) => setConfirmPassword(text)}
                                value={confirmPassword}
                                secureTextEntry={true}
                                placeholder="Confirm password"
                                placeholderTextColor="#c4c4c4"
                                autoCapitalize="none"
                                className=" p-4 border-gray-300 border-2 rounded-md"
                            />

                            {!passwordMatchBool && password.length > 0 && (
                                <Text className="text-red-500">
                                    passowords do not match! :({" "}
                                </Text>
                            )}
                            {/* OTCsent can be looked at as the bottom buttons, including the otc check textinput */}

                            {OTCsent ? (
                                <View className="gap-2">
                                    <Text>
                                        Confirmation email sent!, please enter 6
                                        digit code below
                                    </Text>
                                    <TextInput
                                        onChangeText={(text) => {
                                            // Only allow whole numbers (no decimals)
                                            const numericText = text.replace(/[^0-9]/g, "");
                                            setOTCCode(numericText);
                                        }}
                                        value={OTCcode}
                                        placeholder="Enter 6 digit code"
                                        placeholderTextColor="#c4c4c4"
                                        autoCapitalize={"none"}
                                        keyboardType="numeric"
                                        className=" p-4 border-gray-300 border-2 rounded-md"
                                    />
                                    <Pressable
                                        onPress={() =>
                                            verifyEmailOtpAndSetPassword()
                                        }
                                        disabled={loading}
                                        className="p-4 bg-red-300 rounded-md items-center"
                                    >
                                        <Text className="font-bold text-red-700 text-lg">
                                            Confirm 6 digit code
                                        </Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <View className="flex-row">
                                    {passwordMatchBool &&
                                    password.length >= 8 ? (
                                        <Pressable
                                            onPress={() => linkAccount()}
                                            disabled={loading}
                                            className="p-4 flex-1 bg-blue-300 rounded-md items-center"
                                        >
                                            <Text className="font-bold text-gray-700 text-lg">
                                                Link account
                                            </Text>
                                        </Pressable>
                                    ) : (
                                        <Pressable
                                            onPress={() =>
                                                Alert.alert(
                                                    "password must be at least 8 characters",
                                                    "and matching*-",
                                                )
                                            }
                                            className="p-4 flex-1 bg-gray-300 rounded-md items-center"
                                        >
                                            <Text className="font-bold text-gray-500 text-lg">
                                                Link account
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
