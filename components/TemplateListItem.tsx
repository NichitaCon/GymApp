import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";
import Entypo from "@expo/vector-icons/Entypo";

export default function RoutineListItem({ template }) {
    // const deleteRoutine = async () => {
    //     const { error } = await supabase
    //         .from("templates")
    //         .delete()
    //         .eq("template_id", template.template_id);
    //     onRoutineDeleted();
    // };

    // console.log("template item id = ", template.template_id);
    return (
        <Link href={`/template/${template.template_id}`} asChild>
            <Pressable className="p-4 mb-3 border rounded-xl border-gray-200 bg-gray-100">
                <View className="flex-column">
                    <Text className="text-2xl mb-2" numberOfLines={2}>
                        Endurance routine, {template.template_id}
                        {/* Displaying template name */}
                    </Text>
                    <View className="flex-row justify-between ">
                        <Text className="text-xl text-gray-600">{template.profiles.full_name}</Text>
                        <Text className="text-xl text-gray-600">{template.profiles.role}</Text>
                    </View>

                    {/* <Pressable
                        onPress={() => {
                            deleteRoutine();
                        }}
                    >
                        <Entypo
                            name="trash"
                            size={24}
                            color="grey"
                            className="justify-end"
                        />
                    </Pressable> */}
                    {/* <Text className="text-gray-700">{template.description}</Text> Displaying template description */}
                </View>
            </Pressable>
        </Link>
    );
}
