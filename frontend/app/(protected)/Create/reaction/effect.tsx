import { Button, ScrollView, YStack, H2 } from 'tamagui'
import { useApplet, Applet } from '../../../../context/appletContext'
import { useNavigationData } from '../../../../context/navigationContext'
import { Link } from 'expo-router'
import React, { useRef } from 'react'

const getCurrentReactionName = (applet: Applet, reactionId: string): string => {
  for (let i = 0; i < applet.reactions.length; i++) {
    if (applet.reactions[i].id === reactionId) {
      return applet.reactions[i].name;
    }
  }
  return "";
}

export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const { navigationData, setNavigationData } = useNavigationData();
  const reactions = [
    {id:"0", name:"send_webhook_message"}
  ]

  const idIndex = useRef<number>(0);
  const newId  = useRef<string>("");

  const newReaction = ({ name } : { name : string }) => {
    newId.current = `reaction-${navigationData.currentService}-${name}-${idIndex.current}`;

    for (let i = 0; i < applet.reactions.length; i++) {
      if (applet.reactions[i].id === newId.current) {
        newId.current = `reaction-${navigationData.currentService}-${name}-${idIndex.current + 1}`;
        idIndex.current++;
        i = -1;
      }
    }

    setApplet(
      {
        id: applet.id,
        action: applet.action,
        reactions: [...applet.reactions, 
          {
            id : newId.current,
            name: name,
            service: navigationData.currentService,
            params: []
          }
        ]
      }
    )

    setNavigationData({
      currentService: navigationData.currentService,
      actionType: navigationData.actionType,
      reactionId: newId.current
    });
  }

  const modifyReaction = ({id, name} : {id : string, name : string}) => {
    newId.current = `reaction-${navigationData.currentService}-${name}-${idIndex.current}`;

    for (let i = 0; i < applet.reactions.length; i++) {
      if (applet.reactions[i].id === newId.current) {
        return;
      }
    }

    setApplet(
      {
        id: applet.id,
        action: applet.action,
        reactions: applet.reactions.map((reaction) => {
          if (reaction.id === navigationData.reactionId) {
            return {
              id: newId.current,
              name: name,
              service: navigationData.currentService,
              params: []
            }
          }
          return reaction
        })
      }
    )
  }

  return (
    <ScrollView
    contentContainerStyle={{
      flexGrow: 1, 
      backgroundColor: '$background'
    }}
    style={{ flex: 1 }}>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        <H2>{navigationData.currentService}</H2>
        {reactions.flatMap((reaction, i) => [
            <Link key={`button-${reaction.id}`} href="/Create/reaction/form" asChild>
                <Button
                    onPress={() => {
                      if (navigationData.actionType === "reaction") {
                        newReaction(reaction)
                      } else {
                        modifyReaction(reaction)
                      }
                    }}
                    width="80%"
                    size={getCurrentReactionName(applet, navigationData.reactionId) === reaction.name ? "$8" : "$6"}
                    >
                    <Button.Text>
                      {reaction.name}
                    </Button.Text>
                </Button>
            </Link>
        ])}
      </YStack>
    </ScrollView>
  )
}
