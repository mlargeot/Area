import React, { useState } from 'react';
import { YStack } from 'tamagui';
import ForgotPassword from '../components/forgotpassword';
import {useColorScheme} from "react-native";

export default function forgotpasswordscreen() {
    const theme = useColorScheme();

    const backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
    return (
        <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            backgroundColor={backgroundColor}
            padding="$4"
        >
            <ForgotPassword/>
        </YStack>
    );
}