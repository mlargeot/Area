import { XStack, YStack, Text, Button, ScrollView, Stack, Dialog, Adapt, Sheet, Fieldset, Input, Label, Select, TooltipSimple, Unspaced } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react';
import React from 'react';
import { useMedia } from 'tamagui'
import axios from 'axios';
import { Platform } from 'react-native';

// let services = [
//     { name: 'Discord', color: '#5865F2', isActive: true, email: ''},
//     { name: 'Spotify', color: '#1DB954', isActive: false, email: ''},
//     { name: 'Twitch', color: '#9146FF', isActive: true, email: ''},
//     { name: 'Google', color: '#FF0000', isActive: true, email: ''},
//     { name: 'Github', color: '#333333', isActive: false, email: ''},
// ];

function Header() {
    const router = useRouter();
    return (
        <XStack ai="center" jc="space-between" px="$4" pt="$5" py="$2" bg="$background" borderBottomWidth={1} borderBottomColor="$borderColor">
            <Button onPress={() => router.push('/profile')} icon={ArrowLeft} />
            <Text fontWeight="700" fontSize="$10">Profile</Text>
            <Stack width={40} />
        </XStack>
    );
}

export default function ProfileScreen() {
    const [services, setServices] = useState<any[]>([]);

    const router = useRouter();
    const media = useMedia()
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const apiUrl = process.env.EXPO_PUBLIC_API_URL ||'http://localhost:8080';

    const fetchServices = async () => {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.get(apiUrl + `/auth/list-services`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("response", response);
            if (response.status === 200) {
                setServices(response.data);
            }
        } catch (error) {
            console.error(error);
        }

    }

    const connectToService = async (service: any) => {
        const state = btoa(JSON.stringify({
            provider: service.name.toLowerCase(),
            action: 'connect'
        }));
        console.log('service', service.name);
        let serviceAuthUrl = '';
        const redirect_uri = "http://localhost:8081/auth-handler";
        let client_id = '';
        switch (service.name) {
            case 'Google':
                client_id = "388588349871-q74b1h4i7ojhn5ki7hn7l2293lhuf1cd.apps.googleusercontent.com";
                serviceAuthUrl  = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&prompt=consent&access_type=offline&response_type=code&scope=openid profile email&state=${state}`;
                break;
            case 'Discord':
                client_id = "1312074760917745734";
                serviceAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify%20email&state=${state}`;
                break;
            case 'Github':
                client_id = "Ov23litCcN0j3UsIyU3S";
                serviceAuthUrl = `https://github.com/login/oauth/authorize?client_id=I${client_id}&redirect_uri=${redirect_uri}&scope=user&state=${state}`;
                break;
            default:
                alert('Service not supported');
                return;
        }
        if (serviceAuthUrl === '') {
            alert('Service not supported');
            return;
        }
        if (Platform.OS === 'web') {
            window.location.href = serviceAuthUrl;
            return;
        }
    }

    const disconnect = () => {
        AsyncStorage.removeItem('access_token');
        router.push('/explore');
    }

    const toggleDialog = (service: any) => {
        setSelectedService(service);
        setDialogVisible(!isDialogVisible);
    }

    useEffect(() => {
        fetchServices();
    } , []);

    return (
        <YStack f={1} bg="$background">
            <Header />
            <ScrollView>
                <YStack paddingVertical="$4" width="100%" alignItems="center" gap="$4">
                    <XStack
                        key={services.length}
                        flexWrap="wrap"
                        justifyContent="center"
                        gap="$4"
                        width="100%"
                    >
                        {services.map((service, index) => (
                        <Button
                            key={index}
                            backgroundColor={service.color}
                            height={80}
                            justifyContent="center"
                            alignItems="center"
                            borderRadius="$2"
                            onPress={() => toggleDialog(service)}
                            width={media.sm ? '80%' : '30%'}
                            style={{ opacity: service.isActive ? 1 : 0.5 }}
                        >
                            <Text
                            color="#fff"
                            fontSize={18}
                            >
                            {service.name}
                            </Text>
                            <Text color="#fff" fontSize={14}>
                            {service.isActive ? 'Activated' : 'Deactivated'}
                            </Text>
                        </Button>
                        ))}
                    </XStack>
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
                                    {selectedService.email}
                                </Dialog.Description>
                                <Dialog.Description>
                                    {selectedService.isActive ? 'This service is currently activated.' : 'This service is currently deactivated.'}
                                </Dialog.Description>
                                {!selectedService.isActive && (
                                    <Button onPress={() => connectToService(selectedService)}>
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
            </Dialog>        
        </YStack>
    )
}
