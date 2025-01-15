import { Button, Stack, YStack, Text, XStack } from 'tamagui';
import { Link } from 'expo-router';
import { useNavigationData } from '../context/navigationContext';
import { Reaction } from "../context/appletContext";
import React, { useState } from 'react';
import { Delete } from '@tamagui/lucide-icons'


export function ReactionButton({ index, reaction, deleteReaction } : { index : number, reaction: Reaction, deleteReaction?: () => void }) {
  const { setNavigationData } = useNavigationData();
  const [page, setPage] = useState<string>(reaction.service === "" ? "services" : "reaction/form");
  const width = deleteReaction ? "70%" : "80%";

  return (
    <XStack width="100%" justifyContent='center'>
      <Link href={`/Create/${page}`} asChild>
        <Button
        onPress={() => {
          setNavigationData({
            currentService: reaction.service ? reaction.service : "",
            actionType: !reaction.service ? "reaction" : "modify",
            reactionId: reaction._id ? reaction._id : ""
          })}}
        borderWidth="$1"
        alignSelf="center"
        borderColor="#7C3AED"
        padding="$3"
        borderRadius="$2"
        height="fit-content"
        width={width}
        justifyContent='flex-start'
        >
          <YStack gap="$2">
            <XStack gap="$2">
              <Stack
                borderWidth="$1"
                borderColor="$color"
                padding="$2"
                borderRadius="$2"
              >
                <Button.Text>{reaction.service !== "" ? reaction.service : 'Reaction'}</Button.Text>
              </Stack>
            </XStack>
            <Text
              opacity={0.60}
            >{index.toString()}. { reaction.name ? reaction.name : "Select the reaction"}</Text>
          </YStack>
        </Button>
      </Link>
      {deleteReaction && (
        <Button icon={Delete} onPress={deleteReaction} width="20%" marginTop="$2">
        </Button>
      )}
    </XStack>
  )
}
