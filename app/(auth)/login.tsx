import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, TextInput, Button, Pressable, Text } from 'react-native'
import { Stack } from 'expo-router'

import { supabase } from '../../utils/supabase'


// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View className='flex-1 gap-4 p-5 pt-10 bg-white'>
        <Stack.Screen options={{ title: "Sign in"}}/>

        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          className='border p-3 border-gray-400 rounded-md'
        />


        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          className='border p-3 border-gray-400 rounded-md'
        />

        <View className='flex-row gap-3'>            
            <Pressable 
                onPress={() => signInWithEmail()}
                disabled={loading}
                className='p-4 flex-1 border border-gray-400 rounded-md items-center'>
                    <Text className='font-bold text-gray-600 text-lg'>
                        Sign in
                    </Text>
            </Pressable>

            <Pressable 
                onPress={() => signUpWithEmail()}
                disabled={loading}
                className='p-4 flex-1 bg-blue-400 rounded-md items-center'>
                    <Text className='font-bold text-white text-lg'>
                        Sign up
                    </Text>
            </Pressable>
        </View>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})