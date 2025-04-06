import { View, Text, Pressable, TouchableOpacity } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";

export default function Tip({ title, text1, text2 }) {
    return (
        <View className="gap-2 p-4  rounded-2xl border border-gray-200 bg-gray-100">
            {title !== undefined && <Text className="text-3xl">{title}</Text>}
            {text1 !== undefined && <Text>{text1}</Text>}
            {text2 !== undefined && <Text>{text2}</Text>}
        </View>
    );
}
