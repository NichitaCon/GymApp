import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";
import Entypo from "@expo/vector-icons/Entypo";

export default function RoutineListItem({ routine, onRoutineDeleted }) {
    const deleteRoutine = async () => {
        const { error } = await supabase
            .from("routines")
            .delete()
            .eq("routine_id", routine.routine_id);
        onRoutineDeleted();
    };

    // console.log("routine item id = ", routine.routine_id);
    return (
        <Link href={`/routine/${routine.routine_id}`} asChild>
            <Pressable className="p-4 mb-3 border rounded-xl border-gray-200 bg-gray-100">
                <View className="flex-row justify-between items-center">
                    <Text className="text-2xl w-4/5" numberOfLines={1}>
                        {routine.name}
                        {/* Displaying routine name */}
                    </Text>
                    <Pressable
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
                    </Pressable>
                    {/* <Text className="text-gray-700">{routine.description}</Text> Displaying routine description */}
                </View>
            </Pressable>
        </Link>
    );
}
