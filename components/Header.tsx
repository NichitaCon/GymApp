import { View, Text, Pressable, TouchableOpacity } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import RestTimer from "./RestTimer";

export default function Header({ header, back, rightButtons = [] }) {
    const insets = useSafeAreaInsets();
    const AdjustedInset = insets.top - 5;
    const [isBackEnabled, setIsBackEnabled] = useState(
        back === undefined ? true : back,
    );
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: AdjustedInset,
            }}
            className="pb-5 bg-white"
        >
            {isBackEnabled == true && (
                <Pressable onPress={() => router.back()}>
                    <Entypo
                        name="chevron-left"
                        size={36}
                        color="black"
                        className="justify-center mb-2 mr-2"
                    />
                </Pressable>
            )}
            <Text
                className="text-6xl flex-1"
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {header}
            </Text>

            <RestTimer></RestTimer>

            {rightButtons.map((btn, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={btn.onPress}
                    className="ml-2"
                >
                    {btn.component}
                </TouchableOpacity>
            ))}
        </View>
    );
}
