import React, { useEffect, useRef } from 'react';
import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square } from 'tamagui'
import { ActionButton } from '../../../components/actionButton'
import { ReactionButton } from '../../../components/reactionButton'
import { useApplet, Reaction, Applet } from '../../../context/appletContext'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const emptyReaction = () => {
  const empty : Reaction = {name: "", _id: "", service: "", params: []}
  return (empty)
}

const isActionValid = (applet : Applet) => {
  return applet.action.service !== "" && applet.action.name !== "" && applet.action._id !== "" && applet.reactions.length > 0
}

export default function CreateScreen() {
  const { applet, setApplet } = useApplet();
  const serverAddress = useRef<string>(process.env.EXPO_PUBLIC_API_URL ||'http://localhost:8080');
  const accessToken = useRef<string>("");
  

  const saveApplet = () => {
    if (serverAddress.current === "" || !isActionValid(applet)) { return; }

    const url = `${serverAddress.current}/applets`;
    const appletData = {
      name: "test",
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
    console.log("URL:", url, "DATA:", appletData, "TOKEN:", accessToken.current);

    axios.post(url, appletData, {headers: { Authorization: `Bearer ${accessToken.current}` }}).catch((error) => {
      console.log("Error while saving applet, the parameters given might be invalid", error);
    });
  };

  const emptyApplet = () => {
    setApplet({appletId: "",action: { service: "", name: "", _id: "", params: [] }, reactions: []})
  }

  const deleteReaction = (index: number) => {
    const newReactions = applet.reactions.filter((_, i) => i !== index);
    setApplet({ ...applet, reactions: newReactions });
  }

  useEffect(() => {
    try {
      AsyncStorage.getItem("serverAdress").then((value) => {
        if (value !== null) {
          serverAddress.current = value;
        }
      });
      AsyncStorage.getItem("access_token").then((value) => {
        if (value !== null) {
          accessToken.current = value;
        }
      });
    } catch (error) {
      console.error("Error while getting server address from AsyncStorage", error);
    }
  }, []);

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
          <ReactionButton key={`card-${reaction._id}`} index={2 + i} reaction={reaction} deleteReaction={() => {deleteReaction(i)}}/>,
          <Square key={`square-${reaction._id}`} height={20} width={4} backgroundColor="$color" opacity={0.5} />,
        ])}
        <ReactionButton index={2 + applet.reactions.length} reaction={emptyReaction()}/>
        <Button
          onPress={saveApplet}
          width="80%" marginTop="$4"
        >
          <Text color="white">Save Applet</Text>
        </Button>
        <Button
          onPress={emptyApplet}
          width="80%" marginTop="$2"
        >
          <Text color="white">Discard Applet</Text>
        </Button>
      </YStack>
    </ScrollView>
  )
}
