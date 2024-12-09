import React from 'react';
import { Button, XStack, YStack, Stack, Text } from 'tamagui';
import { ArrowLeft, X } from '@tamagui/lucide-icons';

const ReturnButton = ({action} : {action : () => void}) => {
  return (
    <YStack paddingBottom="$4" alignItems="center" gap="$1" width="100%" >
        <XStack
            gap="$2"
            borderRadius={0}
            width="100%"
            justifyContent='flex-start'
        >
            <Button
                margin="$1"
                borderRadius="$6"
                alignContent='center'
                onPress={action}
            >
                <Button.Icon>
                    <ArrowLeft />
                </Button.Icon>
                <Button.Text>Back</Button.Text>
            </Button>
        </XStack>
    </YStack>
  );
};

export default ReturnButton;
