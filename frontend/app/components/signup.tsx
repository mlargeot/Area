import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Button, Input, Stack, Text, Theme, XStack, YStack } from 'tamagui';

export default function SignUp() {
  const systemTheme = useColorScheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
          Create an Account
        </Text>

        <Stack gap="$4">
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
          backgroundColor={theme === 'dark' ? '#ffffff' : '#000000'}
          color={theme === 'dark' ? '#000000' : '#ffffff'}
          paddingHorizontal="$6"
          borderRadius="$3"
          fontWeight="700"
          hoverStyle={{
            backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
          }}
          pressStyle={{
            backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
          }}
        >
          Sign Up
        </Button>

        <XStack alignItems="center" justifyContent="center" marginTop="$4">
          <Text
            fontSize="$2"
            color={theme === 'dark' ? '#aaaaaa' : '#777777'}
          >
            Already have an account?
          </Text>
          <Link
            href="../login/page"
            style={{
              marginLeft: 8,
              fontSize: 14,
              color: theme === 'dark' ? '#bb86fc' : '#6200ea',
              textDecorationLine: 'underline',
            }}
          >
            Log in
          </Link>
        </XStack>
      </YStack>
    </Theme>
  );
}
