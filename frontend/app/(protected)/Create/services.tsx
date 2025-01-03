import { Button, ScrollView, YStack, } from 'tamagui'
import { Link } from 'expo-router'
import { useNavigationData } from '../../../context/navigationContext'
import { useServiceList } from '../../../context/serviceListContext';
import React, { useEffect } from 'react';

const selectPage = () => {
  const { navigationData } = useNavigationData();
  const type = navigationData.actionType || "";
  if (type !== "action") {
    return "/Create/reaction/effect";
  }
  return "/Create/action/effect";
}

const Action = () => {
  const { serviceActionList } = useServiceList();
  const { navigationData, setNavigationData } = useNavigationData();
  const currentService = navigationData.currentService || "";

  return (
    serviceActionList.flatMap((service, i) => [
      <Link key={`button-${i}`} href={selectPage()} asChild>
        <Button
          onPress={() => {
            setNavigationData({
              currentService: service.service,
              actionType: navigationData.actionType,
              reactionId: navigationData.reactionId
            });
          }}
          width="80%"
          size={currentService === service.service ? "$8" : "$6"}
          >
          <Button.Text>
            {service.service}
          </Button.Text>
        </Button>
      </Link>
    ])
  )
}

const Reaction = () => {
  const { serviceReactionList } = useServiceList();
  const { navigationData, setNavigationData } = useNavigationData();
  const currentService = navigationData.currentService || "";

  return (
    serviceReactionList.flatMap((service, i) => [
      <Link key={`button-${i}`} href={selectPage()} asChild>
        <Button
          onPress={() => {
            setNavigationData({
              currentService: service.service,
              actionType: navigationData.actionType,
              reactionId: navigationData.reactionId
            });
          }}
          width="80%"
          size={currentService === service.service ? "$8" : "$6"}
          >
          <Button.Text>
            {service.service}
          </Button.Text>
        </Button>
      </Link>
    ])
  )
}


export default function ServicesScreen() {
  const { navigationData } = useNavigationData();
  const type = navigationData.actionType || "";

  return (
    <ScrollView
    contentContainerStyle={{
      flexGrow: 1,
      backgroundColor: '$background'
    }}
    style={{ flex: 1 }}>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        {
          type === "action" ?
          <Action /> :
          <Reaction />
        }
      </YStack>
    </ScrollView>
  )
}
