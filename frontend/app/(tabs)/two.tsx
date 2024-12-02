import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square } from 'tamagui'
import { EventButton } from '../components/eventButton'
import { ActionButton } from '../components/actionButton'
import { Card } from '../components/card'
import { useState } from 'react'


type Action = {
  type: string;
};

export default function TabTwoScreen() {
  const [action, setAction] = useState<Action[]>([])

  return (
    <ScrollView flex={1} alignItems="center" justifyContent="center" bg="$background">
      <YStack gap="$1" alignItems="center" width="fit-content">
        <EventButton index={1}/>
        <Square height={20} width={4} backgroundColor="$color" opacity={0.5} />
        {action.map((a, i) =>
          <>
            <Card index={2 + i} name={a.type}/>
            <Square height={20} width={4} backgroundColor="$color" opacity={0.5} />
          </>
        )}
        <ActionButton index={2 + action.length} action={() => {setAction([...action, {type: "newAction"}])}}/>
      </YStack>
    </ScrollView>
  )
}
