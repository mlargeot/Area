import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { YStack, Text } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthHandler = () => {
    const navigation = useNavigation();
    const route: any = useRoute();

    useEffect(() => {
        if (route.params?.token) {
            AsyncStorage.setItem('token', route.params.token);
            // @ts-ignore
            navigation.navigate('Explore');
        } else {
            // @ts-ignore
            navigation.navigate('login/page');
        }
    }, [route.params]);

    return (
        <YStack flex={1} justifyContent="center" alignItems="center">
            <Text fontSize="$7" fontWeight="700" textAlign="center">
                Loading...
            </Text>
        </YStack>
    );

}

export default AuthHandler;