import React from 'react';
import { ScrollView} from 'react-native';
import { useEffect, useState } from 'react';
import {Text, Button, YStack, XStack, Card, Paragraph  } from 'tamagui';
import { useRouter } from 'expo-router';
import { useMedia } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from './../../components/header';
import axios from 'axios';
import ConnectService from "../../hooks/connectService";

export default function helpcenter() {
    const [services, setServices] = useState<any[]>([]);

    const media = useMedia();
    const router = useRouter();

    const apiUrl = process.env.EXPO_PUBLIC_API_URL ||'http://localhost:8080';

    const fetchServices = async () => {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.get(apiUrl + `/services`, {
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

    useEffect(() => {
        fetchServices();
    } , []);

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
                    <Card
                        bordered
                        width={media.sm ? '90%' : '20%'}
                        borderWidth={2}
                        borderRadius="$4"
                        >
                        <YStack>
                            <Card.Header padded>
                            <XStack gap="$3" alignItems="center">
                                <YStack flex={1}>
                                <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                                    Getting Started
                                </Text>
                                </YStack>
                            </XStack>
                            </Card.Header>
                            <Card.Footer padded>
                            <YStack gap="$3" width="100%" alignItems="flex-start">
                                <Paragraph size={media.sm ? "$2" : "$3"}>
                                    Learn how to getting started with our step-by-step guide.
                                </Paragraph>
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
                            </YStack>
                            </Card.Footer>
                        </YStack>
                    </Card>
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
                                    <XStack flex={1}>
                                        <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                                            About {service?.service}
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
                                        onPress={() => router.push({
                                            pathname: '/helpService/Helppage',
                                            params: {serviceName: service.service},
                                          })
                                        }>
                                        Read more
                                    </Button>
                                </YStack>
                                </Card.Footer>
                            </YStack>
                        </Card>
                    ))}
                </XStack>   
            </YStack>
        </ScrollView>
    </YStack>
  );
}
