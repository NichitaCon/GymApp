import {
    View,
    Text,
    Pressable,
    FlatList,
    ActivityIndicator,
    TextInput,
    KeyboardAvoidingView,
    Modal,
    ScrollView,
    Platform,
} from "react-native";
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
import React from "react";
import { useAuth } from "~/contexts/AuthProvider";
import Entypo from "@expo/vector-icons/Entypo";

export default function Exercises() {
    const { routineId } = useLocalSearchParams();
    const { user } = useAuth();

    const [allExercises, setAllExercises] = useState([]);
    const [routineExercises, setRoutineExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [newExerciseName, setNewExerciseName] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllExercises();
        fetchRoutineExercises();
        // updateRoutineExercises();
        console.log("useEffect Triggered in: exercises.tsx");
    }, [routineId]);

    if (loading) {
        console.log("LOADING");
        return <ActivityIndicator />;
    }
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
            .eq("routine_id", routineId);

        if (error) {
            console.error(
                "Error reading exercises in routine_exercises: ",
                error,
            );
            return;
        } else if (!data || data.length === 0) {
            console.warn("Exercises from routine_exercises are empty.");
        } else {
            setRoutineExercises(data);
            setSelectedExercises(data.map((exercise) => exercise.exercise_id));
            // console.log("Exercises from routine_exercises: ", data);
        }
    };

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

    const createNewExercise = async () => {
        const { data, error } = await supabase
            .from("exercises")
            .insert([{ creator_id: user.id, name: newExerciseName }])
            .select();

        if (error) {
            console.log("error creating exercise:", error);
            return null;
        }
    };

    const updateRoutineExercises = async () => {
        console.log("starting updateRoutineExercises function");
        setLoading(true);
        // Find exercises to delete (that were previously selected but are no longer selected)
        const exercisesToRemove = routineExercises.filter(
            (exercise) => !selectedExercises.includes(exercise.exercise_id),
        );

        console.log("exercisesToRemove = ", exercisesToRemove);

        // Find exercises to add (new exercises)
        const exercisesToAdd = selectedExercises.filter(
            (exerciseId) =>
                !routineExercises.some((ex) => ex.exercise_id === exerciseId),
        );

        // Delete the exercises that are no longer selected
        const { error: deleteError } = await supabase
            .from("routine_exercises")
            .delete()
            .in(
                "routine_exercise_id",
                exercisesToRemove.map((ex) => ex.routine_exercise_id),
            );

        if (deleteError) {
            console.error("Error removing exercises:", deleteError);
            return;
        }

        // Add or update the exercises that were newly selected
        const { data: insertData, error: insertError } = await supabase
            .from("routine_exercises")
            .upsert(
                exercisesToAdd.map((exerciseId) => ({
                    exercise_id: exerciseId,
                    routine_id: routineId,
                    order_index: null, // Can set a default order or determine the order dynamically
                    rest_duration: 90, // Can set a default rest duration or customize
                })),
                { onConflict: ["exercise_id", "routine_id"] }, // Prevent duplicates based on exercise_id and routine_id
            );

        if (insertError) {
            console.error("Error adding/updating exercises:", insertError);
            return;
        }
        setLoading(false);
        console.log("Routine exercises updated successfully:");
    };

    const handleCreateExercise = async () => {
        await createNewExercise();
        await setNewExerciseName("");
        await fetchAllExercises();
        setModalVisible(false);
    };

    const saveAndNavigateBack = async () => {
        await updateRoutineExercises();
        console.log("router.back");
        router.back();
    };

    const filteredExercises = allExercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <View className="flex-1 p-5 bg-white pb-safe-offset-0">
            <Stack.Screen options={{ title: "Exercises" }} />

            {/* <Text className="text-4xl mb-5 text-center">Exercises</Text> */}

            {/* <Text>routine id = {routineId}</Text> */}

            <TextInput
                className="bg-gray-100 rounded-lg mb-5 p-4 border-2 border-gray-300"
                placeholder="Search Exercises"
                placeholderTextColor={"black"}
                onChangeText={(text) => {
                    setSearchQuery(text);
                    setNewExerciseName(text);
                }}
                value={searchQuery}
            />
            <FlatList
                data={filteredExercises}
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
                ListFooterComponent={() => (
                    <Pressable
                        onPress={() => {
                            setModalVisible(true);
                            console.log("Add exercise pressed");
                        }}
                        className="bg-gray-100 rounded-lg mb-3 mt-4 p-2  flex-row justify-between items-center"
                    >
                        <Text className="text-xl text-center">
                            Create New Exercise
                        </Text>
                        <Entypo
                            name="plus"
                            size={24}
                            color="black"
                            className="bg rounded-full p-1"
                        />
                    </Pressable>
                )}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <Pressable
                    onPress={() => setModalVisible(false)}
                    className="flex-auto justify-end items-center bg-black/20 backdrop-blur-xl"
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full"
                    >
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Pressable
                                onPress={() => setModalVisible(true)}
                                className="bg-white p-6 rounded-lg w-full"
                            >
                                <View className="">
                                    <Text className="text-3xl mb-1">New exercise Name:</Text>
                                    <TextInput
                                        value={newExerciseName}
                                        onChangeText={(text) =>
                                            setNewExerciseName(text)
                                        }
                                        placeholder="New Exercise Name"
                                        placeholderTextColor="gray"
                                        className="mb-4 p-3 rounded-lg bg-gray-200"
                                    />
                                </View>

                                <View className="flex-row justify-between">
                                    <Pressable
                                        className="p-3 px-4 rounded-lg bg-gray-200"
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text className="text-xl">Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        className="p-3 px-4 rounded-lg bg-gray-200"
                                        onPress={() => {
                                            handleCreateExercise();
                                        }}
                                    >
                                        <Text className="text-xl">Save</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Pressable>
            </Modal>

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
                        saveAndNavigateBack();
                    }}
                >
                    <Text className="text-xl">Save</Text>
                </Pressable>
            </View>
        </View>
    );
}
