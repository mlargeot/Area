import { useState } from 'react';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Button, Input, Stack, Text, Theme, XStack, YStack } from 'tamagui';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login() {
    const systemTheme = useColorScheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const theme = systemTheme === 'dark' ? 'dark' : 'light';

    return (
        <Theme name={theme}>
            <YStack
                flex={1}
                justifyContent="center"
                alignItems="center"
                backgroundColor={theme === 'dark' ? '#000000' : '#ffffff'}
                padding="$6"
            >
                <YStack
                    width={320}
                    padding="$6"
                    borderRadius="$4"
                    backgroundColor={theme === 'dark' ? '#1e1e1e' : '#f9f9f9'}
                    shadowColor={theme === 'dark' ? '#000000' : '#aaaaaa'}
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
                        color={theme === 'dark' ? '#ffffff' : '#000000'}
                    >
                        Sign In to AR3M
                    </Text>

                    <XStack justifyContent="space-between" width="100%" marginBottom="$4">
                        <Button
                            flex={1}
                            marginEnd="$2"
                            backgroundColor="#ffffff"
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            paddingVertical="$2"
                            icon={<FontAwesome name="google" size={24} color="#DB4437" />}
                        />
                        <Button
                            flex={1}
                            marginStart="$2"
                            backgroundColor="#5865F2"
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            paddingVertical="$2"
                            icon={
                                <MaterialCommunityIcons name="discord" size={24} color="#ffffff" />
                            }
                        />
                    </XStack>

                    <Text
                        fontSize="$2"
                        marginBottom="$3"
                        color={theme === 'dark' ? '#aaaaaa' : '#777777'}
                    >
                        OR CONTINUE WITH
                    </Text>

                    <Stack gap="$3" width="100%" marginBottom="$4">
                        <Input
                            placeholder="email"
                            value={username}
                            onChangeText={setUsername}
                            backgroundColor={theme === 'dark' ? '#333333' : '#f2f2f2'}
                            color={theme === 'dark' ? '#ffffff' : '#000000'}
                            borderWidth={0}
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            fontSize="$4"
                        />
                        <Input
                            placeholder="password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            backgroundColor={theme === 'dark' ? '#333333' : '#f2f2f2'}
                            color={theme === 'dark' ? '#ffffff' : '#000000'}
                            borderWidth={0}
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            fontSize="$4"
                        />
                    </Stack>

                    <Button
                        backgroundColor="#8E44AD"
                        color="#ffffff"
                        borderRadius="$3"
                        fontWeight="700"
                        width={"80%"}
                        marginBottom="$2"
                    >
                        Sign Up
                    </Button>
                </YStack>
            </YStack>
        </Theme>
    );
}
