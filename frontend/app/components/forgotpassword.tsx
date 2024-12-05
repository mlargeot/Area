import React, { useState } from 'react';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Button, Input, Stack, Text, XStack, YStack } from 'tamagui';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login() {
  const theme = useColorScheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const backgroundColor = theme === 'dark' ? '#1e1e1e' : '#000000';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';

  return (
      <YStack
          padding="$6"
          borderRadius="$4"
          backgroundColor={backgroundColor}
          width={320}
          shadowColor={theme === 'dark' ? '#000000' : '#aaaaaa'}
          shadowOffset={{ width: 0, height: 4 }}
          shadowRadius={6}
          shadowOpacity={0.3}
      >
        <Text
            fontSize="$7"
            fontWeight="700"
            textAlign="center"
            color={textColor}
        >
          We have send a password to your mail, go check !
        </Text>

      </YStack>
  );
}
