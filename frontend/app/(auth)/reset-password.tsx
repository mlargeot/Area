import React, { useState } from 'react';
import { YStack } from 'tamagui';
import ForgotPassword from './components/forgotpassword';

export default function forgotpasswordscreen() {
    return (
        <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$4"
        >
            <ForgotPassword/>
        </YStack>
    );
}