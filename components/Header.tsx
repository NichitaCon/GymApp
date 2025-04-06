import { View, Text, Pressable, TouchableOpacity } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";

export default function Header({ header }) {
    return (
        <View className="mt-10 mb-4">
            <Text className="text-6xl" numberOfLines={1} ellipsizeMode="tail">
                {header}
            </Text>
        </View>
    );
}
