import React, { useState } from 'react';
import {Button, H2, Input, Stack, Text, XStack, YStack} from 'tamagui';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import {Linking, Platform} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';

const apiUrl = 'http://localhost:8080';

const handleGoogleLogin = () => {
    if (Platform.OS === 'web') {
        window.location.href = `${apiUrl}/auth/google?device=web`;
        return;
    }
    Linking.openURL(`${apiUrl}/auth/google?device=${Platform.OS}`);
}

const handleDiscordLogin = () => {
    if (Platform.OS === 'web') {
        window.location.href = `${apiUrl}/auth/discord?device=web`;
        return;
    }
    Linking.openURL(`${apiUrl}/auth/discord?device=${Platform.OS}`);
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        if (email === '' || password === '') {
            setErrorMessage('Please fill out all fields');
            return;
        }

        try {
            var response = await axios.post(`${apiUrl}/auth/register`, {
                email,
                password
            });
            if (response.status !== 201) {
                setErrorMessage("An error occurred");
                return;
            }
            response = await axios.post(`${apiUrl}/auth/login`, {
                email,
                password
            });
            await AsyncStorage.setItem('access_token', response.data.access_token);
            router.push('/explore');
        } catch (error) {
            console.error(error);
            setErrorMessage("An error occurred");
        }
    }

    return (
            <YStack
                flex={1}
                justifyContent="center"
                alignItems="center"
            >
                <YStack
                    width={320}
                    padding="$6"
                    borderRadius="$4"
                    shadowOffset={{ width: 0, height: 4 }}
                    shadowRadius={8}
                    shadowOpacity={0.3}
                    alignItems="center"
                >
                    <Text
                        fontSize="$6"
                        fontWeight="700"
                        textAlign="center"
                        marginBottom="$4"
                    >
                        Sign In to AR3M
                    </Text>

                    <XStack width="100%" marginBottom="$4" justifyContent="center" gap={15}>
                        <Button
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            paddingVertical="$2"
                            icon={<FontAwesome name="google" size={24}/>}
                            onPress={handleGoogleLogin}
                        />
                        <Button
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            paddingVertical="$2"
                            icon={<MaterialCommunityIcons name="discord" size={24}/>}
                            onPress={handleDiscordLogin}
                        />
                    </XStack>

                    <Text
                        fontSize="$2"
                        marginBottom="$3"
                    >
                        OR CONTINUE WITH
                    </Text>

                    <Stack gap="$3" width="100%" marginBottom="$4">
                        <Text>email</Text>
                        <Input
                            placeholder="email"
                            value={email}
                            onChangeText={setEmail}
                            borderWidth={0}
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            fontSize="$4"
                        />
                        <Text>password</Text>
                        <Input
                            placeholder="password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            borderWidth={0}
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            fontSize="$4"
                        />
                        <Input
                            placeholder="confirm password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            borderWidth={1}
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            fontSize="$4"
                        />
                    </Stack>

                    <Button
                        borderRadius="$3"
                        fontWeight="700"
                        width={"80%"}
                        marginBottom="$2"
                        onPress={handleSignUp}
                    >
                        Sign Up
                    </Button>
                    {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
                </YStack>
            </YStack>
    );
}
