import {Text, YStack, Button, XStack, Stack, Input } from 'tamagui';
import { useState } from 'react';


export default function Login() {
    const [email, setEmail] = useState('');


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
            Reset your password !
        </Text>

        <Stack gap="$3" width="100%" marginBottom="$4">
            <Input
                placeholder="email"
                value={email}
                onChangeText={setEmail}
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
        >
            New Password
        </Button>
    </YStack>
</YStack>
  );
}
