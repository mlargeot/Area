import { Platform } from 'react-native';
import { YStack, Theme, Text } from 'tamagui';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useEffect} from "react";

export default function AuthHandler() {
    const router = useRouter();
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

    const handleAuth = async () => {
        const url = Platform.select({
            web: window.location.href,
            default: window.location.href,
        });

        const params = new URLSearchParams(url.split('?')[1]);
        const token = params.get('token');
        console.log('token', token);
        if (!token) {
            router.push('/login');
            return;
        }
        await AsyncStorage.setItem('access_token', token);
        router.push('/explore');

    };

    useEffect(() => {
        handleAuth();
    }, []);

    return (
        <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$4"
        >
            <Text>Authenticating...</Text>
        </YStack>
    );
}