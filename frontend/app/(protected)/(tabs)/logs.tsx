import { ExternalLink } from '@tamagui/lucide-icons'
import { Anchor, H2, Paragraph, XStack, YStack } from 'tamagui'
import AppletLog from '../../../components/log'

export default function LogsScreen() {
  return (
    <YStack f={1} bg="$background">
      <AppletLog />
    </YStack>
  )
}
