import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square, H2 } from 'tamagui'
import { act, useEffect, useState } from 'react'
import { useApplet, Applet } from 'app/Context/appletContext'
import { useNavigationData, NavigationData } from 'app/Context/navigationContext'
import { Link } from 'expo-router'


export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const reactions = [
    {id:"0", name:"On message received"},
    {id:"1", name:"On message sent"},
    {id:"2", name:"On ping"}
  ]
  const { navigationData } = useNavigationData();

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
            <Link key={`button-${reaction.id}`} href="/create" asChild >
                <Button
                    onPress={() => {
                      setApplet(
                        {
                          id: applet.id,
                          action: applet.action,
                          reactions: [...applet.reactions, 
                            {
                              id : `reaction-${reactions.length.toString()}`,
                              name: reaction.name,
                              service: navigationData.currentService
                            }
                          ]
                        }
                      )
                    }}
                    width="80%"
                    size={navigationData.currentService === reaction.name ? "$8" : "$6"}
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
