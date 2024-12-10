import { ExternalLink } from '@tamagui/lucide-icons'
import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square } from 'tamagui'
import { ActionButton } from '../Pages/Create/components/actionButton'
import { ReactionButton } from '../Pages/Create/components/reactionButton'
import { useApplet, Reaction } from '../../context/appletContext'

const emptyReaction = () => {
  const empty : Reaction = {name: "", id: "", service: ""}
  return (empty)
}

export default function CreateScreen() {
  const { applet } = useApplet();

  return (
    <ScrollView
    contentContainerStyle={{
      flexGrow: 1, 
      backgroundColor: '$background'
    }}
    style={{ flex: 1 }}>
      <YStack paddingVertical="$4" alignItems="center" gap="$1" width="100%">
        <ActionButton index={1}/>
        <Square height={20} width={4} backgroundColor="$color" opacity={0.5} />
        {applet.reactions.flatMap((reaction, i) => [
          <ReactionButton key={`card-${reaction.id}`} index={2 + i} reaction={reaction} />,
          <Square key={`square-${reaction.id}`} height={20} width={4} backgroundColor="$color" opacity={0.5} />,
        ])}
        <ReactionButton index={2 + applet.reactions.length} reaction={emptyReaction()}/>
      </YStack>
    </ScrollView>
  )
}

