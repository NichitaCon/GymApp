import { View, Text, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Link } from "expo-router";
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';

export default function RoutineListItem({ routine }) {
    return (
        <Link href={`/routine/${routine.routine_id}`} asChild>
            <Pressable className="p-4 mb-3 border rounded-xl border-gray-200 bg-gray-100">
                <View className="flex-row">
                    <View className="flex-1 gap-1">
                        <Text className="text-2xl" numberOfLines={2}>
                            {routine.name}, {routine.routine_id} {/* Displaying routine name */}
                        </Text>
                        {/* <Text className="text-gray-700">{routine.description}</Text> Displaying routine description */}
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}
