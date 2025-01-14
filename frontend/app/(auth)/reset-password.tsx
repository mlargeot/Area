import React, { useState } from 'react';
import {Button, Input, Stack, Text, YStack} from 'tamagui';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Link } from "expo-router";


function Reset() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const urlToken = new URLSearchParams(window.location.search).get('token');

    const handleReset = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        if (password === '') {
            setErrorMessage('Please fill out all fields');
            return;
        }
        if (urlToken === null) {
            setErrorMessage('Invalid token');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/auth/reset-password', {
                password,
                token: urlToken
            });
            setSuccessMessage('Password changed successfully');
        }
        catch (error) {
            console.error(error);
            setErrorMessage('An error occurred');
        }
    }

    return (
        <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$6"
            bg={'$background'}
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
                    Choose a new password
                </Text>

                <Stack gap="$3" width="100%" marginBottom="$4">
                    <Input
                        placeholder="password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        borderWidth={1}
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
                    onPress={handleReset}
                >
                    Change Password
                </Button>
                {errorMessage && <Text color="red">{errorMessage}</Text>}
                {successMessage && (
                    <>
                        <Text color="green">{successMessage}</Text>
                        <Link href={"/login"} asChild>
                            <Button
                                borderRadius="$3"
                                fontWeight="700"
                                width={"80%"}
                                marginTop="$2"
                            >
                                Go to Login
                            </Button>
                        </Link>
                    </>
                )}
            </YStack>
        </YStack>
    );
}


export default function resetPassword() {
    return (
        <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$4"
        >
            <Reset/>
        </YStack>
    );
}