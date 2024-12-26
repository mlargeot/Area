import React from 'react';
import { ScrollView, Image } from 'react-native';
import {Text, Button, YStack, XStack, Anchor  } from 'tamagui';
import { useRouter } from 'expo-router';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { useMedia } from 'tamagui'

function Header() {
    const router = useRouter();
    return (
        <XStack ai="center" jc="space-between" px="$4" pt="$5" py="$2" bg="$background" borderBottomWidth={1} borderBottomColor="$borderColor">
            <Button onPress={() => router.push('/Pages/helpcenter')} icon={ArrowLeft} />
            <Text fontWeight="700" fontSize="$10">GitHub Service Guide</Text>
            <Anchor
                onPress={() => router.push('/explore')}
            >
                <Image
                    source={require('./../../../assets/logo.png')}
                    style={{ width: 100, height: 50, borderRadius: 10 }}
                />
            </Anchor>
        </XStack>
    );
}

export default function helpcenter() {
    const media = useMedia();
    const router = useRouter();

  return (
    <YStack f={1} bg="$background">
        <Header />
        <ScrollView>
        </ScrollView>
    </YStack>
  );
}
