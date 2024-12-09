import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square } from 'tamagui'
import { act, useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { useNavigationData, NavigationData } from 'app/Context/navigationContext'
import { useApplet } from 'app/Context/appletContext';


export default function ServicesScreen() {
  const services = [
    {id:"0", name:"Discord"},
    {id:"1", name:"Google"},
    {id:"2", name:"Twitch"},
    {id:"3", name:"Github"},
    {id:"4", name:"Spotify"},
    {id:"5", name:"Microsoft"},
  ]
  const { navigationData, setNavigationData } = useNavigationData();
  const { applet, setApplet } = useApplet();

  const resetAction = (serviceName : string) => {
    if (applet.action.service !== serviceName) {
      setApplet({
        action: {
          service: "",
          name: "",
          id: ""
        },
        reactions: applet.reactions,
        id: applet.id
    })
  }}

  return (
    <ScrollView
    contentContainerStyle={{
      flexGrow: 1,
      backgroundColor: '$background'
    }}
    style={{ flex: 1 }}>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        {services.flatMap((a, i) => [
          <Link key={`button-${a.id}`} href={navigationData.actionType === "action" ? "/Pages/Create/actions" : "/Pages/Create/reactions"} asChild>
            <Button
              onPress={() => {
                setNavigationData({
                currentService: a.name,
                actionType: a.name})
                resetAction(a.name);
              }}
              width="80%"
              size={navigationData.currentService === a.name ? "$8" : "$6"}
              >
              <Button.Text>
                {a.name}
              </Button.Text>
            </Button>
          </Link>
        ])}
      </YStack>
    </ScrollView>
  )
}
