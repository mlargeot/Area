import { ExternalLink } from '@tamagui/lucide-icons'
import { Anchor, H2, Paragraph, XStack, YStack, Text } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';


export default function ProfileScreen() {
  const router = useRouter();
  const disconnect = () => {
    AsyncStorage.removeItem('access_token');
    router.push('/explore');
  }

  return (
    <YStack f={1} ai="center" gap="$8" px="$10" pt="$5" bg="$background">
      <H2>Profile</H2>
      <XStack gap="$4">
        <Anchor href="#" onPress={disconnect}>
          <ExternalLink size={16} />
          <Text>Disconnect</Text>
        </Anchor>
      </XStack>
    </YStack>
  )
}
