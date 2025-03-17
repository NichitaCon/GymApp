import { View, Text, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Link } from "expo-router";
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';

export default function RoutineListItem({ routine }) {
    return (
        <Link href={`/routine/${routine.id}`} asChild>
            <Pressable className="gap-3 p-3 border-b border-gray-200">
                <View className="flex-row">
                    <View className="flex-1 gap-1">
                        <Text className="text-xl font-bold" numberOfLines={2}>
                            {routine.name} {/* Displaying routine name */}
                        </Text>
                        <Text className="text-gray-700">{routine.description}</Text> {/* Displaying routine description */}
                        {routine.is_private ? (
                            <Text className="text-red-500">Private</Text>
                        ) : (
                            <Text className="text-green-500">Public</Text>
                        )}
                        <Text className="text-gray-500">Created on {new Date(routine.created_at).toLocaleDateString()}</Text> {/* Displaying created date */}
                    </View>
                </View>

                <View className="flex-row gap-3">
                    <Feather name="bookmark" size={24} color="gray" />
                    <Feather name="share" size={24} color="gray" />
                </View>
            </Pressable>
        </Link>
    );
}
