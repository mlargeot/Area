import {Text, YStack, Theme } from 'tamagui';

export default function Login() {

  return (
      <YStack
          padding="$6"
          borderRadius="$4"
          width={320}
          shadowOffset={{ width: 0, height: 4 }}
          shadowRadius={6}
          shadowOpacity={0.3}
      >
        <Text
            fontSize="$7"
            fontWeight="700"
            textAlign="center"
        >
          We have send a password to your mail, go check !
        </Text>

      </YStack>
  );
}
