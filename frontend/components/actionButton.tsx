import { Button, Stack, YStack, XStack } from 'tamagui';
import { Link } from 'expo-router';
import { useNavigationData } from '../context/navigationContext';
import { useApplet } from '../context/appletContext';
import { useEffect, useState } from 'react';
import React from 'react';

export function ActionButton({ index } : { index : number }) {
  const { setNavigationData } = useNavigationData();
  const { applet } = useApplet();
  const [page, setPage] = useState<string>(applet.action.service === "" ? "services" : "action/form");

  useEffect(() => {
    setPage(applet.action.service === "" ? "services" : "action/form");
  }, [applet])

  return (
    <Link href={`/Create/${page}`} asChild>
      <Button
      onPress={() => {setNavigationData({
        currentService: applet.action.service,
        actionType: "action",
        reactionId: ""
      })}}
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
              <Button.Text>{applet.action.service ? applet.action.service : "Trigger"}</Button.Text>
            </Stack>
          </XStack>
          <Button.Text
            opacity={0.60}
          >{index.toString()}. { applet.action.name ? applet.action.name : " Select the event that start the workflow"}</Button.Text>
        </YStack>
      </Button>
    </Link>
  )
}
