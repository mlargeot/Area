import { Button, Stack, YStack, Text, XStack } from 'tamagui';
import { Link } from 'expo-router';
import { storage } from '../context/navigationContext';
import { Reaction } from "../context/appletContext";
import React, { useEffect, useState } from 'react';


export function ReactionButton({ index, reaction } : { index : number, reaction: Reaction }) {
  const [page, setPage] = useState<string>(reaction.service === "" ? "services" : "reaction/form");

  return (
    <Link href={`/Create/${page}`} asChild>
      <Button
      onPress={() => {
        storage.set('currentService', reaction.service ? reaction.service : "");
        storage.set('actionType', !reaction.service ? "reaction" : "modify");
        storage.set('reactionId', reaction.id ? reaction.id : "");
      }}
      borderWidth="$1"
      borderColor="$color"
      padding="$3"
      borderRadius="$2"
      borderStyle='dotted'
      height="fit-content"
      width="80%"
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
  )
}
