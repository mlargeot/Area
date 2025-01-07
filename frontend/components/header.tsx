import { Button, XStack, Text, Anchor } from 'tamagui';
import { Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft } from '@tamagui/lucide-icons';

export default function Header({ title, onPress }: any) {

    const router = useRouter();
    return (
        <XStack ai="center" jc="space-between" px="$4" pt="$5" py="$2" bg="$background" borderBottomWidth={1} borderBottomColor="$borderColor">
            <Button onPress={() => router.push(onPress)} icon={ArrowLeft} />
            <Text fontWeight="700" fontSize="$9">{title}</Text>
            <Anchor
                onPress={() => router.push('/explore')}
            >
                <Image
                    source={require('./../assets/logo.png')}
                    style={{ width: 100, height: 50, borderRadius: 10 }}
                />
            </Anchor>
        </XStack>
    );
}