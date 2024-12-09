import { useState } from 'react';
import { Link } from 'expo-router';
import {Alert, Linking, Platform} from 'react-native';
import {Button, Input, Stack, Text, XStack, YStack} from 'tamagui';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Constants from 'expo-constants';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        if (Platform.OS === 'web') {
            window.location.href = `http://localhost:8080/auth/google`;
        } else {
            Linking.openURL(`http://localhost:8080/auth/google`);
        }

    }

    const handleDiscordLogin = () => {
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
                width={320}
                shadowOffset={{ width: 0, height: 4 }}
                shadowRadius={6}
                shadowOpacity={0.3}
            >
                <Text
                    fontSize="$7"
                    fontWeight="700"
                    textAlign="center"
                    marginBottom="$6"
                >
                    Welcome to our AR3M
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

                <XStack alignItems="center" justifyContent="center" marginVertical="$4">
                    <Text fontSize="$2">
                        OR CONTINUE WITH
                    </Text>
                </XStack>

                <Stack gap="$4" marginBottom="$4">
                    <Input
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
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
                        borderWidth={1}
                        borderRadius="$3"
                        paddingHorizontal="$4"
                        fontSize="$4"
                    />
                </Stack>



                <XStack alignItems="center" justifyContent="center" marginVertical="$3">
                <Link
                        href="../forgotpassword/page"
                    >
                        <Text
                            fontSize="$2"
                            >
                            Forgotten Password ?
                            </Text>
                    </Link>
                </XStack>

                <Button
                    marginTop="$4"
                    paddingHorizontal="$6"
                    borderRadius="$3"
                    fontWeight="700"
                >
                    Sign In
                </Button>

                <XStack alignItems="center" justifyContent="center" marginTop="$4">
                    <Link
                        href="../signup/page"
                    >
                        <Text
                            fontSize="$2"
                            >
                            Don't have an AR3M account yet? Sign Up
                            </Text>
                    </Link>
                    
                </XStack>
            </YStack>
    );
}
