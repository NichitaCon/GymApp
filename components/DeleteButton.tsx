import Entypo from "@expo/vector-icons/Entypo";
import { Button, Pressable, Text, View } from "react-native";

export function DeleteButton() {
    return (
        <View className="">
            <Entypo
                name="trash"
                size={24}
                color="black"
                className="p-3"
            />
        </View>
    );
}
