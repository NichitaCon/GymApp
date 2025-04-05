import { useLocalSearchParams, Stack, Link, router } from "expo-router";
import {
    View,
    Text,
    Image,
    Pressable,
    ActivityIndicator,
    FlatList,
    Modal,
    TextInput,
} from "react-native";

import { supabase } from "~/utils/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthProvider";
import RoutineListItem from "~/components/RoutineListItem";
import ExerciseListItem from "~/components/ExerciseListItem";
import Entypo from "@expo/vector-icons/Entypo";
import Exercises from "../exercise/exercises";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export default function RoutinePage() {
    const { templateId } = useLocalSearchParams();
    const [template, setTemplate] = useState([]);
    const [templateExercise, setTemplateExercise] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [userRole, setUserRole] = useState("User");

    console.log("template = ", templateId);
    useEffect(() => {
        fetchTemplate();
        fetchTemplateExercise();
        fetchCurrentProfileRole();
    }, []);

    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    const fetchTemplate = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("templates")
            .select("*")
            .eq("template_id", templateId)
            .single();
        setTemplate(data);
        setLoading(false);

        if (error) {
            console.error("Error fetching exercises:", error);
            return;
        } else {
            console.log("fetchexercise from routinerxercise = ", data);
        }

        setLoading(false);
    };

    const fetchTemplateExercise = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("template_exercises")
            .select("*, exercises(*)")
            .eq("template_id", templateId);
        setTemplateExercise(data);
        setLoading(false);

        if (error) {
            console.error("Error fetching exercises:", error);
            return;
        } else {
            console.log("fetchexercise from TemplateExercise = ", data);
        }

        setLoading(false);
    };

    const fetchCurrentProfileRole = async () => {
        let { data, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (error) {
            console.error("Error fetching profile role:", error);
            return;
        } else {
            console.log("profile role from profiles = ", data);
        }
        setUserRole(data);
    };
    const insertWorkoutTemplate = async () => {
        console.log("Creating routine...");

        // Step 1: Create a new routine
        const { data: routineData, error: routineError } = await supabase
            .from("routines")
            .insert([
                {
                    user_id: user.id,
                    name: template.name,
                    description: template.description,
                },
            ])
            .select("routine_id")
            .single();

        if (routineError) {
            console.error("Error creating routine:", routineError);
            return;
        }

        const routineId = routineData.routine_id;
        console.log("New routine created with ID:", routineId);

        // Step 2: Insert copied exercises into routine_exercises
        const routineExercises = templateExercise.map((exercise) => ({
            routine_id: routineId,
            exercise_id: exercise.exercises.exercise_id,
            rest_duration: exercise.exercises.rest_duration,
        }));

        if (routineExercises.length === 0) {
            console.log("No exercises found for this template.");
            return;
        }

        const { error: insertError } = await supabase
            .from("routine_exercises")
            .insert(routineExercises);

        if (insertError) {
            console.error("Error inserting routine exercises:", insertError);
        } else {
            console.log("Routine exercises added successfully!");
            router.replace("/(tabs)");
        }
    };

    const deleteTemplate = async () => {
        const { error } = await supabase
            .from("templates")
            .delete()
            .eq("template_id", templateId);

        if (error) {
            console.error("deleteTemplate error = ", error);
        }
    };

    const handleDeleteAndReturn = async () => {
        await deleteTemplate();
        router.back();
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    if (!templateId) {
        console.log(templateId);
        return <Text>id not found</Text>;
    }

    console.log("this userRole is = ", userRole);

    return (
        <View className="flex-1 p-4 gap-3 bg-white">
            <Stack.Screen
                options={{
                    title: template ? template?.name : "Template",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                }}
            />

            {template.description ? (
                <View>
                    <Text className="text-2xl">Description:</Text>
                    <Text className="text-3xl">{template.description}</Text>
                </View>
            ) : (
                <Text className="text-2xl">No description available.</Text>
            )}

            <View>
                <Text className="text-2xl">Exercises:</Text>
                <FlatList
                    className="bg-white p-1"
                    data={templateExercise}
                    renderItem={({ item }) => (
                        <View className="flex-row p-3 border border-gray-200 bg-gray-100">
                            <View className="flex-1">
                                <Text className="text-2xl" numberOfLines={1}>
                                    {item.exercises.name}
                                    {/* Displaying exercise name */}
                                </Text>
                                {/* <Text className="text-gray-700">{exercise.exercises.description}</Text> */}
                            </View>
                        </View>
                    )}
                />
            </View>

            <Pressable
                onPress={() => {
                    insertWorkoutTemplate();
                }}
            >
                <Text className="bg-blue-300 p-3 px-4 rounded-full text-center font-semibold text-xl">
                    Add to Workouts
                </Text>
            </Pressable>
            {(template.creator_id === user.id || userRole.role === "Admin") && (
                <Pressable onPress={() => setModalVisible(true)}>
                    <Text className="bg-blue-300 p-3 px-4 rounded-full text-center font-semibold text-xl">
                        Delete Routine
                    </Text>
                </Pressable>
            )}
            {/* <Link href={`/exercise/exercises?routineId=${id}`} asChild>
            <Pressable>
            <Text className="bg-blue-400 p-3 rounded-full text-center font-semibold text-xl">
            Add Exercises
            </Text>
            </Pressable>
            <Exercises updateExerciseList={updateExerciseList} />
            </Link> */}

            <Modal
                animationType="slide"
                transparent={true} // Modal background is transparent
                visible={modalVisible}
            >
                <Pressable
                    onPress={() => {
                        setModalVisible(false);
                    }}
                    className="flex-auto justify-end items-center bg-black/20 backdrop-blur-xl"
                >
                    <Pressable
                        onPress={() => {
                            setModalVisible(true);
                        }}
                        className="bg-white p-6 rounded-lg w-full pb-safe-offset-1"
                    >
                        <Text className="text-4xl mb-2 text-center">
                            Delete
                        </Text>

                        <Text className="text-xl mb-4">
                            Are you sure you want to delete this template?
                        </Text>

                        <View className="flex-row justify-between">
                            <Pressable
                                className="p-3 px-4 rounded-lg bg-gray-200"
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <Text className="text-xl">Cancel</Text>
                            </Pressable>
                            <Pressable
                                className="p-3 px-4 rounded-lg bg-red-200"
                                onPress={() => {
                                    handleDeleteAndReturn();
                                    setModalVisible(false);
                                }}
                            >
                                <Text className="text-xl">Confirm</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
