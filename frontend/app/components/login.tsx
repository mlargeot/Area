import React, { useState } from 'react';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Button, Input, Stack, Text, XStack, YStack } from 'tamagui';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login() {
    const theme = useColorScheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
    const textColor = theme === 'dark' ? '#ffffff' : '#000000';
    const inputBackgroundColor = theme === 'dark' ? '#333333' : '#f9f9f9';
    const inputBorderColor = theme === 'dark' ? '#555555' : '#dddddd';
    const buttonBackgroundColor = theme === 'dark' ? '#6200ea' : '#6200ea';
    const textSecondaryColor = theme === 'dark' ? '#aaaaaa' : '#777777';

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
                />
                <Button
                    backgroundColor="#5865F2"
                    borderRadius="$3"
                    paddingHorizontal="$4"
                    paddingVertical="$2"
                    icon={<MaterialCommunityIcons name="discord" size={24} color="#ffffff" />}
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
