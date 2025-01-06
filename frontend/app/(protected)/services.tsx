import { XStack, YStack, Text, Button, ScrollView, Stack, Dialog, Adapt, Sheet, Fieldset, Input, Label, Select, TooltipSimple, Unspaced } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react';
import React from 'react';
import { useMedia } from 'tamagui'
import axios from 'axios';
import { Platform } from 'react-native';
import ConnectService from "../../hooks/connectService";
import Header from './../../components/header';

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


    const toggleDialog = (service: any) => {
        setSelectedService(service);
        setDialogVisible(!isDialogVisible);
    }

    useEffect(() => {
        fetchServices();
    } , []);

    return (
        <YStack f={1} bg="$background">
            <Header title={`My Services`} onPress={'/profile'}/>
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
                        <XStack
                            key={index}
                            backgroundColor={service.color}
                            borderRadius="$4"
                            padding="$4"
                            width={media.sm ? '20%' : '80%'}
                            alignItems="flex-start"
                            flexDirection="column"
                            gap="$2"
                        >
                            <XStack alignItems="center" gap="$3">
                                <Text color="#fff" fontSize={25}>
                                    {service.name}
                                </Text>
                                <Text color="#fff" fontSize={14}>
                                    {service.isActive ? 'Activated' : 'Deactivated'}
                                </Text>
                            </XStack>
                            <XStack justifyContent="space-between" width="100%" marginTop="$4">
                                <Button
                                    onPress={() => toggleDialog(service)}
                                >
                                    <Text>
                                        {!service.isActive ? 'Connect' : 'Disconnect'}
                                    </Text>
                                </Button>
                            </XStack>
                        </XStack>
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
                                    <Button onPress={() =>ConnectService(selectedService.name.toLowerCase())}>
                                        <Text color="#fff">Connect</Text>
                                    </Button>
                                )}
                                {selectedService.isActive && (
                                    <Button onPress={() => alert('Connect to ' + selectedService.name)}>
                                        <Text color="#fff">Sign out</Text>
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
