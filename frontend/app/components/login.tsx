import { useState, useEffect } from 'react';
import { Link} from 'expo-router'
import { useColorScheme } from 'react-native';
import { Button, Input, Stack, Text, Theme, XStack, YStack  } from 'tamagui';
import { FontAwesome, MaterialCommunityIcons  } from '@expo/vector-icons';

export default function Login() {
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

        <Stack gap="$2" marginBottom="$2">
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
          <Button
            backgroundColor="#002155"
            borderRadius="$3"
            paddingHorizontal="$6"
            fontWeight="700"
            color="#ffffff"
            hoverStyle={{
              backgroundColor: '#002155',
            }}
            pressStyle={{
              backgroundColor: '#002155',
            }}
            icon={<MaterialCommunityIcons name="discord" size={24} color="#ffffff" />}
          >
            Discord
          </Button>
        </Stack>

        <XStack alignItems="center" justifyContent="center" marginVertical="$2" marginBottom="$3">
          <Text fontSize="$2" color={theme === 'dark' ? '#aaaaaa' : '#777777'}>
            OR CONTINUE WITH
          </Text>
        </XStack>

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

        <XStack alignItems="center" justifyContent="center" marginVertical="$3">
          <Link href="../forgotpassword/page"
            style={{
              fontSize: 16,
              color: theme === 'dark' ? '#bb86fc' : '#6200ea',
            }}
          >
            Forgotten password
          </Link>
        </XStack>

        <Button
          marginTop="$1"
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
          Connexion
        </Button>
        <Button
          marginTop="$2"
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
          onPress={() => (window.location.href = '../signup/page')}
        >
          Sign up
        </Button>
      </YStack>
    </Theme>
  );
}
