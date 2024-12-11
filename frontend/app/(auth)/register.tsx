import {Button, H2, Stack, XStack, YStack} from 'tamagui';
import SignUp from '../../components/signup';
import {useRouter} from "expo-router";
import {ArrowLeft} from "@tamagui/lucide-icons";
import React from "react";

function Header() {
    const router = useRouter();
    return (
        <XStack ai="center" jc="space-between" px="$4" py="$2" bg="$background" borderBottomWidth={1} borderBottomColor="$borderColor" width="100%">
            <Button onPress={() => router.back()} icon={ArrowLeft} />
            <Stack width={40} /> {/* Placeholder for alignment */}
        </XStack>
    );
}

export default function signupScreen() {
    return (
        <YStack justifyContent="center" alignItems="center" flex={1}>
            <Header/>
            <SignUp/>
        </YStack>
    );
}