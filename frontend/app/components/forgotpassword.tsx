import { useState, useEffect } from 'react';
import { Link} from 'expo-router'
import { useColorScheme } from 'react-native';
import { Button, Input, Stack, Text, Theme, XStack, YStack } from 'tamagui';

export default function forgottenpassword() {
  const systemTheme = useColorScheme();
  const [email, setEmail] = useState('');
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

  const handleSubmit = () => {
    alert(`Password reset link sent to ${email}`);
  };

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
        alignSelf="center"
      >
        <Text
          fontSize="$7"
          fontWeight="700"
          textAlign="center"
          marginBottom="$6"
          color={theme === 'dark' ? '#ffffff' : '#000000'}
        >
          Reset Password
        </Text>

        <Text
          fontSize="$4"
          textAlign="center"
          marginBottom="$4"
          color={theme === 'dark' ? '#aaaaaa' : '#777777'}
        >
          Enter your email address below and we will send you instructions to reset your password.
        </Text>

        <Stack space="$4">
          <Input
            placeholder="Email Address"
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
        </Stack>

        <Button
          marginTop="$4"
          backgroundColor={theme === 'dark' ? '#6200ea' : '#6200ea'}
          color="#ffffff"
          paddingHorizontal="$6"
          borderRadius="$3"
          fontWeight="700"
          hoverStyle={{
            backgroundColor: '#5c00d9',
          }}
          pressStyle={{
            backgroundColor: '#5c00d9',
          }}
          onPress={handleSubmit}
        >
          Send Reset Link
        </Button>

        <XStack alignItems="center" justifyContent="center" marginVertical="$3">
          <Link href="../login/page"
            style={{
              fontSize: 16,
              color: theme === 'dark' ? '#bb86fc' : '#6200ea',
            }}
          >
            Back to login
          </Link>
        </XStack>
      </YStack>
    </Theme>
  );
}
