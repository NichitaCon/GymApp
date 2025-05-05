import Entypo from "@expo/vector-icons/Entypo";
import { Button, Pressable, Text, View } from "react-native";

export function EditButton() {
    return (
        <View className="">
            <Entypo
                name="pencil"
                size={24}
                color="black"
                className=""
            />
        </View>
    );
}
