import React, { useState } from 'react';
import { Link } from 'expo-router';
import { useColorScheme, Alert } from 'react-native';
import { Button, Input, Stack, Text, XStack, YStack } from 'tamagui';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";

export default function Login() {
    const theme = useColorScheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
    const textColor = theme === 'dark' ? '#ffffff' : '#000000';
    const inputBackgroundColor = theme === 'dark' ? '#333333' : '#f9f9f9';
    const inputBorderColor = theme === 'dark' ? '#555555' : '#dddddd';
    const buttonBackgroundColor = theme === 'dark' ? '#6200ea' : '#6200ea';
    const textSecondaryColor = theme === 'dark' ? '#aaaaaa' : '#777777';

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/auth/google';
    }

    const handleDiscordLogin = () => {
        window.location.href = 'http://localhost:8080/auth/discord';
    }

    const handleEmailPasswordLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username,
                password,
            });

            const token = response.data.token;

            await AsyncStorage.setItem('token', token);

            // @ts-ignore
            navigation.navigate('login/page');

            Alert.alert('Success', response.data.message);
            setUsername('');
            setPassword('');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
                Alert.alert('Login Error', errorMessage);
            } else {
                Alert.alert('Error', 'An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }


    };

    return (
        <YStack
            padding="$6"
            borderRadius="$4"
            backgroundColor={backgroundColor}
            width={320}
            shadowColor={theme === 'dark' ? '#000000' : '#aaaaaa'}
            shadowOffset={{ width: 0, height: 4 }}
            shadowRadius={6}
            shadowOpacity={0.3}
        >
            <Text
                fontSize="$7"
                fontWeight="700"
                textAlign="center"
                marginBottom="$6"
                color={textColor}
            >
                Welcome to our AR3M
            </Text>

            <XStack width="100%" marginBottom="$4" justifyContent="center" gap={15}>
                <Button
                    backgroundColor="#ffffff"
                    borderRadius="$3"
                    paddingHorizontal="$4"
                    paddingVertical="$2"
                    icon={<FontAwesome name="google" size={24} color="#DB4437" />}
                    onPress={handleGoogleLogin}
                />
                <Button
                    backgroundColor="#5865F2"
                    borderRadius="$3"
                    paddingHorizontal="$4"
                    paddingVertical="$2"
                    icon={<MaterialCommunityIcons name="discord" size={24} color="#ffffff" />}
                    onPress={handleDiscordLogin}
                />
            </XStack>

            <XStack alignItems="center" justifyContent="center" marginVertical="$4">
                <Text fontSize="$2" color={textSecondaryColor}>
                    OR CONTINUE WITH
                </Text>
            </XStack>

            <Stack gap="$4" marginBottom="$4">
                <Input
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    backgroundColor={inputBackgroundColor}
                    borderColor={inputBorderColor}
                    color={textColor}
                    borderWidth={1}
                    borderRadius="$3"
                    paddingHorizontal="$4"
                    fontSize="$4"
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    backgroundColor={inputBackgroundColor}
                    borderColor={inputBorderColor}
                    color={textColor}
                    borderWidth={1}
                    borderRadius="$3"
                    paddingHorizontal="$4"
                    fontSize="$4"
                />
            </Stack>



            <XStack alignItems="center" justifyContent="center" marginVertical="$3">
                <Link
                    href="../forgotpassword/page"
                    style={{
                        fontSize: 16,
                        color: textColor,
                        borderColor: inputBorderColor,
                    }}
                >
                    Forgotten password ?
                </Link>
            </XStack>

            <Button
                marginTop="$4"
                backgroundColor={buttonBackgroundColor}
                color="#ffffff"
                paddingHorizontal="$6"
                borderRadius="$3"
                fontWeight="700"
                hoverStyle={{
                    backgroundColor: buttonBackgroundColor,
                }}
                pressStyle={{
                    backgroundColor: buttonBackgroundColor,
                }}
            >
                Sign In
            </Button>

            <XStack alignItems="center" justifyContent="center" marginTop="$4">
                <Text
                    fontSize="$2"
                    textAlign="center"
                    color={textSecondaryColor}
                >
                    Don't have an AR3M account yet?
                </Text>
                <Link
                    href="../signup/page"
                    style={{
                        fontSize: 12,
                        color: textColor,
                        borderColor: inputBorderColor,
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                    }}
                >
                    Sign Up
                </Link>
            </XStack>
        </YStack>
    );
}
