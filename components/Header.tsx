import { View, Text, Pressable, TouchableOpacity } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";

export default function Header({ header, back }) {
    const insets = useSafeAreaInsets();
    const AdjustedInset = insets.top - 5;
    const [isBackEnabled, setIsBackEnabled] = useState(back === undefined ? true : back);
    console.log("insets", AdjustedInset);
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: AdjustedInset,
            }}
            className="pb-5"
        >
            {isBackEnabled == true && 
            <Pressable onPress={() => router.back()}>
                <Entypo
                    name="chevron-left"
                    size={36}
                    color="black"
                    className="justify-center mb-2 mr-2"
                    />
            </Pressable>
                }
            <Text className="text-6xl flex-1" numberOfLines={1} ellipsizeMode="tail">
                {header}
            </Text>
        </View>
    );
}
