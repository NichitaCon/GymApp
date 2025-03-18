import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";

import { supabase } from "~/utils/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthProvider";

export default function RoutinePage() {
    const { id } = useLocalSearchParams();
    // console.log("id = ",id);

    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        fetchRoutine();
    }, [id]);

    const fetchRoutine = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("routines")
            .select("*")
            .eq("routine_id", id)
            .single();
        setRoutine(data);
        setLoading(false);
        console.log("data/routine = ",data)
        console.log("id = ",id)

    };


    if (loading) {
        // return <ActivityIndicator />;
    }

    if (!routine) {
        return <Text>routine not found</Text>;
    }

    return (
        <View className="flex-1 p-3 gap-3 bg-white">
            <Stack.Screen
                options={{
                    title: routine ? routine.name : "Routine",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                }}
            />


            <Text className="text-4xl font-bold" numberOfLines={2}>
                 hi
            </Text>


            {/* Footer */}
            {/* <View className="absolute bottom-0 left-0 right-0 pb-10 p-5 border-t-2 border-gray-100 flex-row justify-between items-center">
                <Text className="text-xl font-semibold">Free</Text>

                {attendance ? (
                    <Text className="font-bold p-4 px-10 border-2 border-blue-300 rounded-md">You're attending!</Text>
                ) : (
                    <Pressable
                        className="p-4 px-10 bg-red-400 rounded-md"
                        onPress={() => joinEvent()}
                    >
                        <Text className="font-bold text-white text-lg">
                            Join and RSVP
                        </Text>
                    </Pressable>
                )}
            </View> */}
        </View>
    );
}
