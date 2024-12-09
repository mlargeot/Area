import { useState } from 'react';
import { Button, Input, Stack, Text, XStack, YStack } from 'tamagui';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
            <YStack
                flex={1}
                justifyContent="center"
                alignItems="center"
                padding="$6"
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
                            icon={<FontAwesome name="google" size={24} color="#DB4437"/>}
                        />
                        <Button
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            paddingVertical="$2"
                            icon={<MaterialCommunityIcons name="discord" size={24}/>}
                        />
                    </XStack>

                    <Text
                        fontSize="$2"
                        marginBottom="$3"
                    >
                        OR CONTINUE WITH
                    </Text>

                    <Stack gap="$3" width="100%" marginBottom="$4">
                        <Input
                            placeholder="email"
                            value={username}
                            onChangeText={setUsername}
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
                            borderWidth={0}
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
                    >
                        Sign Up
                    </Button>
                </YStack>
            </YStack>
    );
}
