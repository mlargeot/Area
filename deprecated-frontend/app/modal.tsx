import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Button, Input, Stack, Text, Theme, XStack, YStack } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';

export default function ModalScreen() {
  const systemTheme = useColorScheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(systemTheme || 'light');

  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setTheme(matchDarkTheme.matches ? 'dark' : 'light');
    };

    matchDarkTheme.addEventListener('change', handleChange);
    handleChange();
    return () => {
      matchDarkTheme.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <Theme name={theme}>
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor={theme === 'dark' ? '#121212' : '#f2f2f2'}
        padding="$4"
      >
        <YStack
          padding="$6"
          borderRadius="$4"
          backgroundColor={theme === 'dark' ? '#1e1e1e' : '#ffffff'}
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
            marginBottom="$6"
            color={theme === 'dark' ? '#ffffff' : '#000000'}
          >
            Welcome to our AR3M
          </Text>

          <Stack space="$4" marginBottom="$4">
            <Button
              backgroundColor="#3b5998"
              borderRadius="$3"
              paddingHorizontal="$6"
              fontWeight="700"
              color="#ffffff"
              hoverStyle={{
                backgroundColor: '#3b5998',
              }}
              pressStyle={{
                backgroundColor: '#3b5998',
              }}
              icon={<FontAwesome name="facebook" size={24} color="#ffffff" />}
            >
              Facebook
            </Button>
            <Button
              backgroundColor="#db4437"
              borderRadius="$3"
              paddingHorizontal="$6"
              fontWeight="700"
              color="#ffffff"
              hoverStyle={{
                backgroundColor: '#db4437',
              }}
              pressStyle={{
                backgroundColor: '#db4437',
              }}
              icon={<FontAwesome name="google" size={24} color="#ffffff" />}
            >
              Google
            </Button>
          </Stack>

          <XStack alignItems="center" justifyContent="center" marginVertical="$4">
            <Text fontSize="$2" color={theme === 'dark' ? '#aaaaaa' : '#777777'}>
              OR CONTINUE WITH
            </Text>
          </XStack>

          <Stack space="$4" marginBottom="$4">
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              backgroundColor={theme === 'dark' ? '#333333' : '#f9f9f9'}
              borderColor={theme === 'dark' ? '#555555' : '#dddddd'}
              color={theme === 'dark' ? '#ffffff' : '#000000'}
              borderWidth={1}
              borderRadius="$3"
              paddingHorizontal="$4"
              fontSize="$4"
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              backgroundColor={theme === 'dark' ? '#333333' : '#f9f9f9'}
              borderColor={theme === 'dark' ? '#555555' : '#dddddd'}
              color={theme === 'dark' ? '#ffffff' : '#000000'}
              borderWidth={1}
              borderRadius="$3"
              paddingHorizontal="$4"
              fontSize="$4"
            />
          </Stack>

          <Button
            marginTop="$4"
            backgroundColor={theme === 'dark' ? '#6200ea' : '#6200ea'}
            color="#ffffff"
            paddingHorizontal="$6"
            borderRadius="$3"
            fontWeight="700"
            hoverStyle={{
              backgroundColor: '#6200ea',
            }}
            pressStyle={{
              backgroundColor: '#6200ea',
            }}
          >
            Connexion
          </Button>
        </YStack>
      </YStack>
    </Theme>
  );
}
