import React, { useEffect, useRef } from 'react';
import { Button, ScrollView, Input, YStack, Text, Label, XStack, Square, Card, H1 } from 'tamagui'
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
    const appletName : string = applet.name === "" ? "Unamed Applet" : applet.name;
    console.log("Saving applet", applet.name, "name:", appletName);

    const url = `${serverAddress.current}/applets`;
    const appletData = {
      name: appletName,
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
    setApplet({name: "", appletId: "",action: { service: "", name: "", _id: "", params: [] }, reactions: []})
  }

  const deleteReaction = (index: number) => {
    const newReactions = applet.reactions.filter((_, i) => i !== index);
    setApplet({ ...applet, reactions: newReactions });
  }

  const handleNameInput = (val: string) => {
    setApplet({ ...applet, name: val });
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
      backgroundColor: '$background',
      minHeight: '100vh'
    }}
    style={{ flex: 1 }}
  >
    <YStack 
      paddingVertical="$4" 
      alignItems="center" 
      gap="$1" 
      width="100%"
      padding="$4"
      maxWidth={1200}
      marginHorizontal="auto"
    >
      <H1 
        marginBottom="$6" 
        textAlign="center"
        color="$color"
        fontSize="$8"
      >
        Create a new applet
      </H1>

      <Card 
        bordered 
        elevate 
        padding="$4"
        marginBottom="$4"
        width="100%"
        borderColor="#10B981"
      >
        <XStack gap="$2" marginBottom="$4" alignItems="center">
          <Label 
            size="$4" 
            color="$color"
          >
            Name of the applet :
          </Label>
          <Input 
            placeholder="My applet" 
            value={applet.name} 
            onChangeText={(val) => handleNameInput(val)}
            borderColor="#3F3F3F"
            borderRadius="$4"
            padding="$3"
            color="$color"
            flex={1}
          />
        </XStack>

        <YStack gap="$4" width="100%">
          <ActionButton 
            index={1}
            // Les styles de ActionButton seront gérés dans son composant
          />
          
          <Square 
            height={20} 
            width={4} 
            backgroundColor="$color" 
            opacity={0.5} 
            alignSelf="center"
          />

          {applet.reactions.flatMap((reaction, i) => [
              <ReactionButton 
                index={2 + i} 
                reaction={reaction} 
                deleteReaction={() => {deleteReaction(i)}}
              />,
            <Square 
              key={`square-${reaction._id}`} 
              height={20} 
              width={4} 
              backgroundColor="$color" 
              opacity={0.5} 
              alignSelf="center"
            />
          ])}

          <ReactionButton 
            index={2 + applet.reactions.length} 
            reaction={emptyReaction()}
          />
        </YStack>

        <YStack gap="$2" marginTop="$4" width="100%">
          <Button
            onPress={saveApplet}
            borderRadius="$4"
            padding="$3"
            animation="quick"
          >
            <Text>Save Applet</Text>
          </Button>

          <Button
            onPress={emptyApplet}
            borderRadius="$4"
            padding="$3"
            animation="quick"
          >
            <Text>Discard Applet</Text>
          </Button>
        </YStack>
      </Card>
    </YStack>
  </ScrollView>
  )
}
