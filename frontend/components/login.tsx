import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import {Alert, Linking, Platform, TouchableOpacity} from 'react-native';
import {Button, Input, Stack, Text, XStack, YStack} from 'tamagui';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import LoginService from "../hooks/loginService";



export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const apiUrl = process.env.EXPO_PUBLIC_API_URL ||'http://localhost:8080';

    const handlerResetPassword = () => {
        if (email === '') {
            alert('Please enter your email address');
            Alert.alert('Please enter your email address');
            return;
        }
        try {
            axios.post(`${apiUrl}/auth/forgot-password`, {
                email
            });
            alert('Password reset email sent');
            Alert.alert('Password reset email sent');
        } catch (error) {
            console.error(error);
            alert('An error occurred');
            Alert.alert('An error occurred');
        }
    }

    const handleLogin = async () => {

        try {
            setIsLoading(true);
            const response = await axios.post(`${apiUrl}/auth/login`, {
                email,
                password
            });
            console.log(response);
            await AsyncStorage.setItem('access_token', response.data.access_token);
            const token = await AsyncStorage.getItem('access_token');
            console.log("async storage set:" + token);
            setIsLoading(false);
            console.log("Logged in" + email + " with token " + response.data.access_token);
            router.push('/explore');
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            setErrorMessage("Invalid credentials");
        }
    }

    const handlePrompt = () => {
        prompt();
    }

    return (
        <YStack padding="$6" borderRadius="$4" width={320} shadowOffset={{ width: 0, height: 4 }} shadowRadius={6} shadowOpacity={0.3}>
            <Text fontSize="$7" fontWeight="700" textAlign="center" marginBottom="$6">Welcome to our AR3M App</Text>
            <XStack width="100%" marginBottom="$4" justifyContent="center" gap={15}>
                <Button borderRadius="$3" paddingHorizontal="$4" paddingVertical="$2" icon={<FontAwesome name="google" size={24}/>} onPress={() => LoginService('google')}/>
                <Button borderRadius="$3" paddingHorizontal="$4" paddingVertical="$2" icon={<MaterialCommunityIcons name="discord" size={24}/>} onPress={() => LoginService('discord')}/>
            </XStack>
            <XStack alignItems="center" justifyContent="center" marginVertical="$4">
                <Text fontSize="$2">OR CONTINUE WITH</Text>
            </XStack>
            <Stack gap="$4" marginBottom="$4">
                <Input placeholder="Email" value={email} onChangeText={setEmail} borderWidth={1} borderRadius="$3" paddingHorizontal="$4" fontSize="$4" />
                <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry borderWidth={1} borderRadius="$3" paddingHorizontal="$4" fontSize="$4" />
            </Stack>
            <XStack alignItems="center" justifyContent="center" marginVertical="$2">
                <TouchableOpacity onPress={handlerResetPassword}>
                    <Text fontStyle='italic' fontSize="$2">Forgotten Password ?</Text>
                </TouchableOpacity>
            </XStack>
            <Button marginTop="$4" paddingHorizontal="$6" borderRadius="$3" fontWeight="700" onPress={handleLogin}>Sign In</Button>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
            <XStack alignItems="center" justifyContent="center" marginTop="$4">
                <Link href={"/register"}>
                    <Text fontSize="$2">Don't have an AR3M account yet? Sign Up</Text>
                </Link>
            </XStack>
        </YStack>
    );
}
