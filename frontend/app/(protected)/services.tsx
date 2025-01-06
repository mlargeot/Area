import { XStack, YStack, Text, Button, ScrollView, Stack, Dialog, Card, Paragraph, Fieldset, Input, Label, Select, TooltipSimple, Unspaced } from 'tamagui'
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

    const media = useMedia();
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
                        flexWrap="wrap"
                        justifyContent="center"
                        gap="$4"
                        width="100%"
                    >
                        {services.map((service, index) => (
                        <Card
                            key={index}
                            bordered
                            borderWidth={2}
                            borderColor={service.color}
                            borderRadius="$4"
                            width={media.sm ? '90%' : '20%'}
                            >
                            <YStack>
                                <Card.Header padded>
                                <XStack gap="$3" alignItems="center">
                                    <XStack flex={1}
                                        flexDirection={media.sm ? "column" : "row"}
                                        alignItems="center"
                                        gap="$2">
                                        <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                                            {service?.name}
                                        </Text>
                                        <Text fontSize={media.sm ? "$2" : "$3"} fontWeight="bold">
                                            {service.isActive ? 'Activated' : 'Deactivated'}
                                        </Text>
                                    </XStack>
                                </XStack>
                                </Card.Header>
                                <Card.Footer padded>
                                <YStack gap="$3" width="100%" alignItems="flex-start">
                                    <Paragraph size={media.sm ? "$2" : "$3"}>
                                        {service?.description}
                                    </Paragraph>
                                    <Button
                                    mt="$2"
                                    bg={service.color}
                                    color="white"
                                    onPress={() => toggleDialog(service)}
                                    >
                                        <Text>
                                            {!service.isActive ? 'Connect' : 'Disconnect'}
                                        </Text>
                                    </Button>
                                </YStack>
                                </Card.Footer>
                            </YStack>
                        </Card>
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
