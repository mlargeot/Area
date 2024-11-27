import { ExternalLink } from '@tamagui/lucide-icons'
import { Input, Anchor, H2, H3, Paragraph, Stack, XStack, YStack } from 'tamagui'
import { ToastControl } from 'app/CurrentToast'
import { useState } from 'react'

export default function settingScreen() {
  const [serverAdress, setServerAdress] = useState(localStorage.getItem('serverAdress') || 'localhost');
  const [serverPort, setServerPort] = useState(localStorage.getItem('serverPort') || '8080');

  return (
    <YStack f={1} ai="center" gap="$0" px="$10" pt="$5" bg="$background">
      <Stack gap="$2">
        <H3>Server Adress:</H3>
        <Input
          onChangeText={(text) => {
            setServerAdress(text)
            localStorage.setItem('serverAdress', text);
          }}
          size="$4"
          borderWidth={2}
          defaultValue={serverAdress}
        />
        <H3>Server Port:</H3>
        <Input
          onChangeText={(text) => {
            setServerPort(text)
            localStorage.setItem('serverPort', text);
          }}
          size="$4"
          borderWidth={2}
          defaultValue={serverPort}
        />
      </Stack>
    </YStack>
  )
}
