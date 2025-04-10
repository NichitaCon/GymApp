import { useLocalSearchParams, Stack, Link, useFocusEffect } from "expo-router";
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
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthProvider";
import RoutineListItem from "~/components/RoutineListItem";
import ExerciseListItem from "~/components/ExerciseListItem";
import Entypo from "@expo/vector-icons/Entypo";
import Exercises from "../exercise/exercises";
import React from "react";
import Tip from "~/components/Tip";
import Header from "~/components/Header";

export default function RoutinePage() {
    const { id, updated } = useLocalSearchParams();
    const [exerciseId, setExerciseId] = useState(null);
    // const [updateExerciseList, setUpdateExerciseList] = useState(() => {
    //     console.log('Exercise list updated');
    // });

    useEffect(() => {
        console.log("updated = ", updated); // Logs the updated value when it changes
    }, [updated]);
    const [routine, setRoutine] = useState(null);
    const [exercise, setExercise] = useState(null);

    const [routineExercise, setRoutineExercise] = useState(null);
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        fetchRoutine();
        fetchRoutineExercise();
        fetchExercise();
        console.log("useEffect Triggered in: [id]1.tsx");
    }, [id]);

    // console.log(exercise);

    useFocusEffect(
        useCallback(() => {
            fetchExercise();
            console.log("usefocus effect called in [id].tsx!");
        }, []),
    );

    // useEffect(() => {
    //     fetchExercise();
    //     console.log("useEffect Triggered in: [id]2.tsx");
    // }, []);

    const fetchRoutine = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("routines")
            .select("*")
            .eq("routine_id", id)
            .single();
        setRoutine(data);
        setLoading(false);
        // console.log("data/routine = ", data);
        // console.log("id = ", id);
        setLoading(false);
    };

    const fetchRoutineExercise = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("*")
            .eq("routine_id", id);
        // .single();
        setRoutineExercise(data);
        setExerciseId(data);
        setLoading(false);
        // console.log("id = ", data, error);
    };

    const fetchExercise = async () => {
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("exercise_id, exercises(*)") // Fetch exercise name
            .eq("routine_id", id);

        if (error) {
            console.error("Error fetching exercises:", error);
            return;
        }
        // console.log("fetchexercise from routinerxercise = ",data)

        setExercise(data);
    };

    const insertTemplateRoutine = async () => {
        console.log("Creating template...");

        // Step 1: Create a new routine
        const { data: templateData, error: templateError } = await supabase
            .from("templates")
            .insert([
                {
                    creator_id: user.id,
                    name: routine.name,
                    description: routine.description,
                },
            ])
            .select("template_id")
            .single();

        if (templateError) {
            console.error("Error creating template:", templateError);
            return;
        }

        const templateId = templateData.template_id;
        console.log("New template created with ID:", templateId);

        // Step 2: Insert copied exercises into template_exercises
        const templateExercises = routineExercise.map((exercise) => ({
            template_id: templateId,
            exercise_id: exercise.exercise_id,
            rest_duration: exercise.rest_duration,
        }));

        if (templateExercises.length === 0) {
            console.log("No exercises found for this template.");
            return;
        }

        const { data: updateData, error: updateError } = await supabase
            .from("routines")
            .update({ template_id: templateId })
            .eq("routine_id", id);

        fetchRoutine();

        const { error: insertError } = await supabase
            .from("template_exercises")
            .insert(templateExercises);

        if (insertError) {
            console.error("Error inserting template exercises:", insertError);
        } else {
            console.log("template exercises added successfully!");
        }
    };

    // useEffect(() => {
    //     console.log("all exercises in routine id ", id, ": ", exercise);
    // }, [exercise]);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         console.log("Screen is focused")
    //         // console.log("exercise before call = ", JSON.stringify(exercise, null, 2))
    //         fetchExercise();
    //         // console.log("exercise after call = ", JSON.stringify(exercise, null, 2))
    //         console.log("fetchRoutine Called")
    //     }, []),
    // );

    // console.log("fetchexercise from routinerxercise = ",exercise)

    if (loading) {
        return <ActivityIndicator />;
    }

    if (!routine) {
        return <Text>routine not found</Text>;
    }

    return (
        <View className="flex-1 p-5 gap-3 bg-white">
            <Stack.Screen
                options={{
                    title: routine ? routine.name : "Routine",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                }}
            />
            <Header header={routine ? routine.name : "Routine"} />

            {exercise?.length === 0 && (
                <View className="">
                    <Tip
                        title={"Adding exercises to your workout"}
                        text1={
                            "Here, you can store all the exercises for this routine. Click the 'Add Exercises' button to get started."
                        }
                        text2={
                            "Once you've added some exercises, you can click into them to record your sets and view your previous sets. You can also post your exercise list as a template for other users to discover and copy if they like it."
                        }
                    />
                </View>
            )}
            <FlatList
                className="bg-white rounded-xl"
                data={exercise}
                renderItem={({ item }) => (
                    <ExerciseListItem exercise={item} routineId={id} />
                )}
            />

            <Link href={`/exercise/exercises?routineId=${id}`} asChild>
                <Pressable>
                    <Text className="bg-blue-400 p-3 rounded-full text-center font-semibold text-xl">
                        Add Exercises
                    </Text>
                </Pressable>
            </Link>
            {routine.template_id === null ? (
                exercise &&
                exercise.length > 0 && (
                    <Pressable onPress={() => insertTemplateRoutine()}>
                        <Text className="bg-blue-400 p-3 rounded-full text-center font-semibold text-xl mb-3">
                            Create Template
                        </Text>
                    </Pressable>
                )
            ) : (
                <Text className="text-center text-gray-400 mb-3">
                    This routine exists as a template
                </Text>
            )}
        </View>
    );
}
