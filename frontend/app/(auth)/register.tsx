import { Button, H2, Stack, XStack, YStack } from 'tamagui';
import SignUp from '../../components/signup';
import { Linking } from 'react-native';
import { ArrowLeft } from '@tamagui/lucide-icons';
import React from 'react';

function Header() {
    return (
        <XStack ai="center" jc="space-between" px="$4" py="$2" borderBottomWidth={1} borderBottomColor="$borderColor" width="100%">
            <Button onPress={() => Linking.openURL('/back')} icon={ArrowLeft} />
            <Stack width={40} />
        </XStack>
    );
}

export default function SignupScreen() {
    return (
        <YStack justifyContent="center" alignItems="center" flex={1} bg={'$background'}>
            <Header />
            <H2>Sign Up</H2>
            <SignUp />
        </YStack>
    );
}