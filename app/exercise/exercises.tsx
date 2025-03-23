import { View, Text, Pressable, FlatList } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import {
    Link,
    router,
    Stack,
    useLocalSearchParams,
    useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";

export default function Exercises() {
    const { routineId } = useLocalSearchParams();
    
    const [allExercises, setAllExercises] = useState([]);
    const [routineExercises, setRoutineExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
    
    useEffect(() => {
        fetchAllExercises();
        fetchRoutineExercises();
    }, [routineId]);
    
    // console.log("exerciseObjArray = ",exerciseObjArray)
    // console.log("Routine id exercises.tsx = ", routineId);
    console.log("selected exercises = ", selectedExercises);
    
    const toggleExerciseSelection = (exerciseId: number) => {
        setSelectedExercises(
            (prev) =>
                prev.includes(exerciseId)
                    ? prev.filter((id) => id !== exerciseId) // Remove if already selected
                    : [...prev, exerciseId], // Add if not selected
        );
    };

    const exerciseObjArray = selectedExercises.map((exerciseId) => ({
        routine_id: routineId,
        exercise_id: exerciseId,
    }));

    const fetchAllExercises = async () => {
        const { data, error } = await supabase.from("exercises").select("*");

        if (error) {
            console.error("Error fetching exercises:", error);
            return;
        }

        setAllExercises(data);
        // console.log("allexercises = ", data, error)
    };

    const fetchRoutineExercises = async () => {
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("*")
            .eq("routine_id", routineId)

            if (error) {
                console.error("Error reading exercises in routine_exercises: ", error);
                return;
            } else if (!data || data.length === 0) {
                console.warn("Exercises from routine_exercises are empty.");
            } else {
                setRoutineExercises(data);
                setSelectedExercises(data.map((exercise) => exercise.exercise_id));
                // console.log("Exercises from routine_exercises: ", data);
            }
    }

    const createRoutineExercises = async () => {
        console.log("create routine exercise CALLED");
        const { data, error } = await supabase
            .from("routine_exercises")
            .insert(exerciseObjArray)
            .select();

        if (error) {
            console.error(
                "Error inserting exercises into routine_exercises: ",
                error,
            );
            return;
        } else {
            console.log("data inserted into routine_exercises: ", data);
        }
    };


    return (
        <View className="flex-1 p-5 bg-white pb-safe-offset-0">
            <Stack.Screen options={{ title: "Exercises" }} />
            {/* <Text className="text-4xl mb-5 text-center">Exercises</Text> */}

            <Text>routine id = {routineId}</Text>
            <FlatList
                data={allExercises}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() =>
                            toggleExerciseSelection(item.exercise_id)
                        }
                        className={`${
                            selectedExercises.includes(item.exercise_id)
                                ? "bg-blue-100"
                                : "bg-gray-100"
                        } rounded-lg mb-3 p-3`}
                    >
                        <Text className="text-xl">{item.name}</Text>
                    </Pressable>
                )}
            />

            <View className="flex-row justify-between p-3">
                <Pressable
                    className="p-3 px-4 rounded-lg bg-gray-200"
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Text className="text-xl">cancel</Text>
                </Pressable>
                <Pressable
                    className="p-3 px-4 rounded-lg bg-gray-200"
                    onPress={() => {
                        createRoutineExercises();
                        router.back();
                    }}
                >
                    <Text className="text-xl">Save</Text>
                </Pressable>
            </View>
        </View>
    );
}
