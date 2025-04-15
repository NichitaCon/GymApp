import { View, Text, Pressable, TouchableOpacity } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header({ header }) {
    return (
        <SafeAreaView className="bg-white mb-2" edges={['top']}>
            <Text className="text-6xl" numberOfLines={1} ellipsizeMode="tail">
                {header}
            </Text>
        </SafeAreaView>
    );
}
