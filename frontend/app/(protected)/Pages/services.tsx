import { ExternalLink } from '@tamagui/lucide-icons'
import { X } from '@tamagui/lucide-icons'
import { Anchor, H2, Paragraph, XStack, YStack, Text, Button, ScrollView, Stack, Dialog, Adapt, Sheet, Fieldset, Input, Label, Select, TooltipSimple, Unspaced } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { useState } from 'react';
import React from 'react';

const services = [
    { name: 'Discord', color: '#5865F2', isActive: true},
    { name: 'Spotify', color: '#1DB954', isActive: false},
    { name: 'Twitch', color: '#9146FF', isActive: true},
    { name: 'X', color: '#1DA1F2', isActive: false},
    { name: 'Google', color: '#FF0000', isActive: true},
    { name: 'Github', color: '#333333', isActive: false},
];

function Header() {
    const router = useRouter();
    return (
        <XStack ai="center" jc="space-between" px="$4" py="$2" bg="$background" borderBottomWidth={1} borderBottomColor="$borderColor">
            <Button onPress={() => router.back()} icon={ArrowLeft} />
            <H2>Profile</H2>
            <Stack width={40} /> {/* Placeholder for alignment */}
        </XStack>
    );
}

export default function ProfileScreen() {
    const router = useRouter();
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const disconnect = () => {
        AsyncStorage.removeItem('access_token');
        router.push('/explore');
    }

    const toggleDialog = (service: any) => {
        setSelectedService(service);
        setDialogVisible(!isDialogVisible);
    }

    return (
        <YStack f={1} bg="$background">
            <Header />
            <XStack gap="$4">
            </XStack>
            <ScrollView>
                <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$4">
                    {services.map((service, index) => (
                        <Button
                            key={index}
                            backgroundColor={service.color}
                            width="80%"
                            height={60}
                            justifyContent='center'
                            alignItems='center'
                            borderRadius="$2"
                            onPress={() => toggleDialog(service)}
                        >
                            <Text
                                color="#fff"
                                fontSize={18}
                                textDecorationLine={service.isActive ? 'none' : 'line-through'}
                            >
                                {service.name}
                            </Text>
                            <Text color="#fff" fontSize={14}>
                                {service.isActive ? 'Activated' : 'Deactivated'}
                            </Text>
                        </Button>
                    ))}
                </YStack>
            </ScrollView>
            <Dialog modal open={isDialogVisible} onOpenChange={setDialogVisible}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        key="overlay"
                        animation="slow"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                    <Dialog.Content
                        bordered
                        elevate
                        key="content"
                        animateOnly={['transform', 'opacity']}
                        animation={[
                            'quicker',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        gap="$4"
                    >
                        {selectedService && (
                            <>
                                <Dialog.Title>{selectedService.name}</Dialog.Title>
                                <Dialog.Description>
                                    {selectedService.isActive ? 'This service is currently activated.' : 'This service is currently deactivated.'}
                                </Dialog.Description>
                                {!selectedService.isActive && (
                                    <Button onPress={() => alert('Connect to ' + selectedService.name)}>
                                        <Text color="#fff">Connect</Text>
                                    </Button>
                                )}
                                <Button onPress={() => setDialogVisible(false)} marginTop="$2">
                                    <Text color="#fff">Close</Text>
                                </Button>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>        </YStack>
    )
}
