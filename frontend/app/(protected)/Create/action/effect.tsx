import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square, H2 } from 'tamagui'
import { storage } from '../../../../context/navigationContext'
import { Link } from 'expo-router'
import { useApplet } from '../../../../context/appletContext';
import { useServiceList, EffectTemplate } from '../../../../context/serviceListContext'
import React from 'react';


export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const { serviceActionList } = useServiceList();
  const currentService = storage.getString("currentService") || "";
  const actions = serviceActionList.filter((service) => service.service === currentService)[0].effect

  return (
    <ScrollView
    contentContainerStyle={{
      flexGrow: 1, 
      backgroundColor: '$background'
    }}
    style={{ flex: 1 }}>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        <H2>{currentService}</H2>
        {actions.flatMap((action, i) => [
            <Link key={`button-${i}`} href="/Create/action/form" asChild >
                <Button
                    onPress={() => {setApplet({
                        action: {
                          service: currentService,
                          name: action.name,
                          id: `action-${actions.length.toString()}`,
                          params: []
                        },
                        reactions: applet.reactions,
                        id: applet.id
                      })
                    }}
                    width="80%"
                    size={applet.action.name === action.name ? "$8" : "$6"}
                    >
                    <Button.Text>
                      {action.name}
                    </Button.Text>
                </Button>
            </Link>
        ])}
      </YStack>
    </ScrollView>
  )
}
