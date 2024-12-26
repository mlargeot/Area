import { Platform } from 'react-native';
import { YStack, Theme } from 'tamagui';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function authHandler() {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    const router = useRouter();
    const urlCode = new URLSearchParams(window.location.search).get('code');
    const state = new URLSearchParams(window.location.search).get('state');
    const urlProvider = state ? JSON.parse(atob(state)).provider : null;
    const action = state ? JSON.parse(atob(state)).action : null;

    const loginService = async (service: string) => {
        try {
            const response = await axios.post(`http://localhost:8080/auth/login/${service}`, {
                code: urlCode,
                service
            });
            console.log("response", response);
            AsyncStorage.setItem('access_token', response.data.access_token);
            if (Platform.OS === 'web') {
                window.location.href = '/explore';
            } else {
                router.push('/explore');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const connectService = async (service: string) => {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.post(`http://localhost:8080/auth/connect/${service}`, {
                code: urlCode,
                service
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("response", response);
        } catch (error) {
            console.error(error);
        }
        if (Platform.OS === 'web') {
            window.location.href = '/services';
        } else {
            router.push('/services');
        }
    }

    if (urlCode) {
        if (action === 'connect') {
            console.log('connectService');
            connectService(urlProvider);
            return;
        }

        console.log('urlCode', urlCode);
        if (urlProvider !== 'google' && urlProvider !== 'discord') {
            console.error('Invalid provider');
            return;
        }
        loginService(urlProvider);
    }

    if (urlToken) {
        AsyncStorage.setItem('access_token', urlToken);
        if (Platform.OS === 'web') {
            window.location.href = '/explore';
        } else {
            router.push('/explore');
        }
    }

    return (
        <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$4"
        >
            
        </YStack>
    );
}