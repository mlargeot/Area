import React, { act } from 'react';
import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square } from 'tamagui'
import { ActionButton } from '../Pages/Create/components/actionButton'
import { ReactionButton } from '../Pages/Create/components/reactionButton'
import { useApplet, Reaction, Applet } from '../../context/appletContext'
import axios from 'axios';

const emptyReaction = () => {
  const empty : Reaction = {name: "", id: "", service: ""}
  return (empty)
}

const isActionValid = (applet : Applet) => {
  return applet.action.service !== "" && applet.action.name !== "" && applet.action.id !== ""
}

export default function CreateScreen() {
  const { applet, setApplet } = useApplet();

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
        <Button
          onPress={() => {
            if (isActionValid(applet)) {
              const appletData = {
                action: {
                  service: applet.action.service.toLowerCase(),
                  name: applet.action.name,
                  params: applet.action.params.reduce((acc, obj) => {
                    return { ...acc, ...obj };
                  }, {})
                },
                reaction: {
                  service: applet.reactions[0].service.toLowerCase(),
                  name: applet.reactions[0].name,
                  params: applet.reactions[0].params.reduce((acc, obj) => {
                    return { ...acc, ...obj };
                  }, {})
                },
                active: true
              }
              const serverAddress = localStorage.getItem("serverAdress");
              const userId = localStorage.getItem("userId");
              const url = `${serverAddress}/applets/${userId}`;
              console.log("URL:", url, "DATA:", appletData);
              axios.post(url, appletData)
            }
          }}
          width="80%" marginTop="$4"
        >
          <Text color="white">Save Applet</Text>
        </Button>
        <Button 
          onPress={() => {
            setApplet({id: "",action: { service: "", name: "", id: "", params: [] }, reactions: []})
          }}
          width="80%" marginTop="$2"
        >
          <Text color="white">Discard Applet</Text>
        </Button>
      </YStack>
    </ScrollView>
  )
}

