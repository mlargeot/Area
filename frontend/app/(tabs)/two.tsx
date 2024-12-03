import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square } from 'tamagui'
import { EventButton } from '../components/eventButton'
import { ActionButton } from '../components/actionButton'
import ReturnButton from '../components/returnButton'
import { Card } from '../components/card'
import { useState } from 'react'


type Action = {
  type: string;
  id: string;
};

export default function TabTwoScreen() {
  const [action, setAction] = useState<Action[]>([])
  const oui : boolean = false;

  return (
    <ScrollView
    stickyHeaderIndices={[0]}
    contentContainerStyle={{
      flexGrow: 1, 
      backgroundColor: '$background'
    }}
    style={{ flex: 1 }}>
      <ReturnButton />
      {
      oui ? 
        <XStack paddingBottom="$4" flexWrap="wrap" width="100%" justifyContent='center' gap="$1" >
          {action.flatMap((a, i) => [
            <Square key={`square-${a.id}`} height={150} width={150} backgroundColor="$color" />,
          ])}
        </XStack>
      :
        <YStack paddingBottom="$4" alignItems="center" gap="$1" width="100%">
          <EventButton index={1}/>
          <Square height={20} width={4} backgroundColor="$color" opacity={0.5} />
          {action.flatMap((a, i) => [
            <Card key={`card-${a.id}`} index={2 + i} name={a.type} />,
            <Square key={`square-${a.id}`} height={20} width={4} backgroundColor="$color" opacity={0.5} />,
          ])}
          <ActionButton index={2 + action.length} action={() => {setAction([...action, {type: "newAction", id : action.length.toString()}])}}/>
        </YStack>
      }
    </ScrollView>
  )
}
