import { router, Stack } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Pressable, Text, TextInput, View } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import Header from "~/components/Header";
import { useAuth } from "~/contexts/AuthProvider";

import { supabase } from "~/utils/supabase";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
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

    const handleSetPassword = async () => {
        console.log("Setting password...");

        if (!passwordMatchBool) {
            console.error("Passwords do not match");
            Alert.alert("Passwords do not match", "Please try again.");
            return;
        } else if (password.length < 8) {
            console.error("Password must be at least 8 characters long");
            Alert.alert(
                "Password too short",
                "Password must be at least 8 characters long.",
            );
            return;
        }

        const { data: updatePasswordData, error: updatePasswordError } =
            await supabase.auth.updateUser({
                password: password,
            });

        if (updatePasswordError) {
            console.error("Password update error:", updatePasswordError);
            if (
                updatePasswordError.message.includes(
                    "Updating password of an anonymous user without an email or phone is not allowed",
                )
            ) {
                Alert.alert(
                    "Password creation error",
                    "You must link your account first, please try again after clicking the link in the email sent to you.",
                );
            } else {
                Alert.alert(
                    "Password creation error, Please try again.",
                    updatePasswordError.message,
                );
            }
            return;
        }

        const { data: updateProfileData, error: updateProfileError } =
            await supabase
                .from("profiles")
                .update({ role: "User" })
                .eq("id", session.user.id);

        if (updateProfileError) {
            console.error("Profile update error:", updateProfileError);
            Alert.alert("Profile update error", "Please try again.");
            return;
        }

        getProfile(); // Refresh profile data after updating

        console.log("Account created successfully!");

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

            {/* if role is not a guest user, present regular settings */}

            <View className="flex-row justify-between">
                {role !== "Guest user" ? (
                    <View className="flex-1">
                        <Text className="text-4xl mb-2 text-gray-900">
                            Account
                        </Text>

                        <View className="bg-gray-100 gap-2 p-3 rounded-3xl">
                            <Pressable
                                onPress={() =>
                                    router.push(
                                        "/profile/profileSettings/editAccount",
                                    )
                                }
                            >
                                <Text className="text-2xl p-1 text-gray-800">
                                    Edit account
                                </Text>
                            </Pressable>
                            <View className="bg-red border rounded-full border-gray-300"></View>
                            <Pressable
                                onPress={() => {
                                    supabase.auth.signOut();
                                    router.replace("/(auth)/login");
                                }}
                            >
                                <Text className="text-2xl p-1 text-gray-800">
                                    Sign out
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    // If the user is a guest, show the guest account creation form
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
                                onChangeText={(text) =>
                                    setConfirmPassword(text)
                                }
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
                                        A confirmation email has been sent.
                                    </Text>
                                    <Text>
                                        Please check your email, click the
                                        confirmation link, and then return to
                                        the app to complete your account.
                                    </Text>
                                    {/* <TextInput
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
                                    /> */}
                                    <Pressable
                                        onPress={() => handleSetPassword()}
                                        disabled={loading}
                                        className="p-4 bg-red-300 rounded-md items-center"
                                    >
                                        <Text className="font-bold text-red-700 text-lg">
                                            Confirm account
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
