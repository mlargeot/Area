import { Platform } from 'react-native';
import { YStack, Theme } from 'tamagui';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function authHandler() {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    const router = useRouter();

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