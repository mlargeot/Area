import React from 'react';
import { ScrollView, Image } from 'react-native';
import {Text, Button, YStack, XStack, Anchor  } from 'tamagui';
import { useRouter } from 'expo-router';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { useMedia } from 'tamagui'

const services = [
    { name: 'Getting Started', color: '#D9D9D9', isActive: true, description:"Learn how to getting started with our step-by-step guide."},
    { name: 'Discord', color: '#5865F2', isActive: true, description:"This is the documentation of reaction and actions discord."},
    { name: 'Spotify', color: '#1DB954', isActive: false, description:""},
    { name: 'Twitch', color: '#9146FF', isActive: true, description:""},
    { name: 'X', color: '#1DA1F2', isActive: false, description:""},
    { name: 'Google', color: '#FF0000', isActive: true, description:""},
    { name: 'Github', color: '#333333', isActive: false, description:"This is the documentation of reaction and actions Github."},
];

function Header() {
    const router = useRouter();
    return (
        <XStack ai="center" jc="space-between" px="$4" pt="$5" py="$2" bg="$background" borderBottomWidth={1} borderBottomColor="$borderColor">
            <Button onPress={() => router.push('/profile')} icon={ArrowLeft} />
            <Text fontWeight="700" fontSize="$10">Help Center</Text>
            <Anchor
                onPress={() => router.push('/explore')}
            >
                <Image
                    source={require('./../../assets/logo.png')}
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
            <YStack paddingVertical="$4" paddingLeft="$10" alignItems="flex-start" width="100%">
                <Text fontSize={24} fontWeight="bold">
                    User Guides
                </Text>
            </YStack>
            <YStack paddingVertical="$4" width="100%" alignItems="center" gap="$4">
                <XStack
                    flexWrap="wrap"
                    justifyContent="center"
                    gap="$4"
                    width="100%"
                >
                    {services.map((service, index) => (
                    <XStack
                        key={index}
                        backgroundColor={service.color}
                        borderRadius="$4"
                        padding="$4"
                        width={media.sm ? '80%' : '20%'}
                        alignItems="flex-start"
                        flexDirection="column"
                        gap="$2"
                    >
                        <Text color="#fff" fontSize={25}>
                        {service.name}
                        </Text>
                        <Text color="#fff" fontSize={14}>
                            {service.description}
                        </Text>
                        <Button
                            marginTop="$4"
                            onPress={() => router.push('/Pages/helpService/Help' + service.name)}
                        >
                            <Text fontSize={14}>
                                Read More
                            </Text>
                        </Button>
                    </XStack>
                    ))}
                </XStack>   
            </YStack>
        </ScrollView>
    </YStack>
  );
}
