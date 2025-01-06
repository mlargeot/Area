import { Button, ScrollView, YStack, H2 } from 'tamagui'
import { useApplet, Applet } from '../../../../context/appletContext'
import { useServiceList } from '../../../../context/serviceListContext'
import { useNavigationData } from '../../../../context/navigationContext'
import { Link } from 'expo-router'
import React, { useEffect, useRef } from 'react'

const getCurrentReactionName = (applet: Applet, reactionId: string): string => {
  for (let i = 0; i < applet.reactions.length; i++) {
    if (applet.reactions[i]._id === reactionId) {
      return applet.reactions[i].name;
    }
  }
  return "";
}

export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const { serviceReactionList } = useServiceList();
  const { navigationData, setNavigationData } = useNavigationData();
  const currentService = navigationData.currentService;
  const actionType = navigationData.actionType;
  const reactionId = navigationData.reactionId;
  const reactions = serviceReactionList.filter((service) => service.service.toLowerCase() === currentService.toLowerCase())[0].effect;

  const idIndex = useRef<number>(0);
  const newId  = useRef<string>("");

  const newReaction = ({ name } : { name : string }) => {
    newId.current = `${idIndex.current}`;

    for (let i = 0; i < applet.reactions.length; i++) {
      if (applet.reactions[i]._id === newId.current) {
        newId.current = `${idIndex.current + 1}`;
        idIndex.current++;
        i = -1;
      }
    }

    setApplet(
      {
        appletId: applet.appletId,
        action: applet.action,
        reactions: [...applet.reactions, 
          {
            _id : newId.current,
            name: name,
            service: currentService,
            params: []
          }
        ]
      }
    )

    setNavigationData({
      currentService: currentService,
      actionType: actionType,
      reactionId: newId.current
    })
  }

  const modifyReaction = (name : string) => {
    for (let i = 0; i < applet.reactions.length; i++) {
      if (applet.reactions[i].name === name) {
        return;
      }
    }

    setApplet(
      {
        appletId: applet.appletId,
        action: applet.action,
        reactions: applet.reactions.map((reaction) => {
          if (reaction._id === reactionId) {
            return {
              _id: reaction._id,
              name: name,
              service: currentService,
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
        <H2>{currentService}</H2>
        {reactions.flatMap((reaction, i) => [
            <Link key={`button-${i}`} href="/Create/reaction/form" asChild>
                <Button
                    onPress={() => {
                      if (actionType === "reaction") {
                        newReaction(reaction)
                      } else {
                        modifyReaction(reaction.name)
                      }
                    }}
                    width="80%"
                    size={getCurrentReactionName(applet, reactionId) === reaction.name ? "$8" : "$6"}
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
