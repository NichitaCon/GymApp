import { View, Text, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Link } from "expo-router";
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';

export default function ExerciseListItem({ exercise, routineId }) {
    return (
        <Link href={`/exercise/${exercise.exercise_id}?routineId=${routineId}`} asChild>
            <Pressable className="p-3 border border-gray-200 bg-gray-100">
                <View className="flex-row">
                    <View className="flex-1">
                        <Text>routine id = {routineId}</Text>
                        <Text className="text-2xl" numberOfLines={1}>
                            {exercise.exercises.name} - Exercise id: {exercise.exercise_id} {/* Displaying exercise name */}
                        </Text>
                    {/* <Text className="text-gray-700">{exercise.exercises.description}</Text> */}
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}
