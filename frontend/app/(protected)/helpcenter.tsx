import React from 'react';
import { ScrollView} from 'react-native';
import {Text, Button, YStack, XStack, Anchor  } from 'tamagui';
import { useRouter } from 'expo-router';
import { useMedia } from 'tamagui';
import Header from './../../components/header';

const services = [
    { name: 'Discord', color: '#5865F2', isActive: true, description:"This is the documentation of reaction and actions discord."},
    { name: 'Spotify', color: '#1DB954', isActive: false, description:""},
    { name: 'Twitch', color: '#9146FF', isActive: true, description:""},
    { name: 'X', color: '#1DA1F2', isActive: false, description:""},
    { name: 'Google', color: '#FF0000', isActive: true, description:""},
    { name: 'Github', color: '#333333', isActive: false, description:"This is the documentation of reaction and actions Github."},
];

export default function helpcenter() {
    const media = useMedia();
    const router = useRouter();

  return (
    <YStack f={1} bg="$background">
        <Header title={`Help Center`} onPress={'/profile'}/>
        <ScrollView>
            <YStack paddingVertical="$4" alignItems="center" width="100%">
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
                    <XStack
                        backgroundColor='#D9D9D9'
                        borderRadius="$4"
                        padding="$4"
                        width={media.sm ? '80%' : '20%'}
                        alignItems="flex-start"
                        flexDirection="column"
                        gap="$2"
                    >
                        <Text color="#fff" fontSize={25}>
                        Getting Started
                        </Text>
                        <Text color="#fff" fontSize={14}>
                        Learn how to getting started with our step-by-step guide.
                        </Text>
                        <Button
                            marginTop="$4"
                            onPress={() => router.push({
                                pathname: '/helpService/Helppage',
                                params: {serviceName: 'Getting Started'},
                              })
                            }
                        >
                            <Text fontSize={14}>
                                Read More
                            </Text>
                        </Button>
                    </XStack>
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
                            onPress={() => router.push({
                                pathname: '/helpService/Helppage',
                                params: {serviceName: service.name},
                              })
                            }
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
