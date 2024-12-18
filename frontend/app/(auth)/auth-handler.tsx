import { Platform } from 'react-native';
import { YStack, Theme } from 'tamagui';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function authHandler() {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    const router = useRouter();
    const urlCode = new URLSearchParams(window.location.search).get('code');

    const connectService = async (service: string) => {
        try {
            const response = await axios.post(`http://localhost:8080/auth/connect/google`, {
                code: urlCode,
                service
            });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    if (urlCode) {
        console.log('urlCode', urlCode);
        connectService('google');
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