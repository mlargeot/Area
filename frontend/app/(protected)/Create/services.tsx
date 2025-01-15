import React from 'react'
import { Button, ScrollView, YStack, XStack, Text, Card, H1 } from 'tamagui'
import { Link } from 'expo-router'
import { useNavigationData } from '../../../context/navigationContext'
import { useServiceList } from '../../../context/serviceListContext'
import { useMedia } from 'tamagui'
import { Zap, Workflow } from '@tamagui/lucide-icons'

const selectPage = () => {
  const { navigationData } = useNavigationData()
  const type = navigationData.actionType || ""
  return type !== "action" ? "/Create/reaction/effect" : "/Create/action/effect"
}

const ServiceButton = ({ service, currentService, setNavigationData, type }) => {
  const media = useMedia()
  const isActive = currentService === service.service

  return (
    <Link href={selectPage()} asChild>
      <Button
        onPress={() => {
          setNavigationData({
            currentService: service.service,
            actionType: type,
            reactionId: ""
          })
        }}
        width={media.sm ? '100%' : '48%'}
        height={80}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundColor={isActive ? '$color' : '#2C2C2C'}
        borderColor={type === "action" ? "#3B82F6" : "#7C3AED"}
        borderWidth={2}
        borderRadius="$4"
        marginBottom="$2"
        hoverStyle={{ 
          scale: 1.03,
          backgroundColor: isActive ? '$color' : '#3C3C3C'
        }}
        pressStyle={{ scale: 0.97 }}
        animation="quick"
      >
        <Text 
          color={isActive ? 'black' : 'white'} 
          fontSize="$4" 
          fontWeight="bold"
        >
          {service.service}
        </Text>
      </Button>
    </Link>
  )
}

const ServiceList = ({ type }) => {
  const { serviceActionList, serviceReactionList } = useServiceList()
  const { navigationData, setNavigationData } = useNavigationData()
  const currentService = navigationData.currentService || ""
  const services = type === "action" ? serviceActionList : serviceReactionList

  return (
    <XStack flexWrap="wrap" justifyContent="space-between" gap="$2">
      {services.map((service, i) => (
        <ServiceButton
          key={`button-${i}`}
          service={service}
          currentService={currentService}
          setNavigationData={setNavigationData}
          type={type}
        />
      ))}
    </XStack>
  )
}

export default function ServicesScreen() {
  const { navigationData } = useNavigationData()
  const type = navigationData.actionType || ""

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#000000'
      }}
      style={{ flex: 1 }}
    >
      <YStack padding="$4" space="$4">
        <Card
          backgroundColor="#1C1C1C"
          borderRadius="$4"
          padding="$4"
        >
          <H1 color="white" textAlign="center" marginBottom="$4">
            {type === "action" ? "Choose an Action" : "Choose a Reaction"}
          </H1>
          <XStack space="$2" justifyContent="center" marginBottom="$4">
            <Button 
              icon={Zap} 
              backgroundColor={type === "action" ? "#3B82F6" : "transparent"}
              borderColor="#3B82F6"
              borderWidth={1}
            >
              <Text color="white">Actions</Text>
            </Button>
            <Button 
              icon={Workflow} 
              backgroundColor={type !== "action" ? "#7C3AED" : "transparent"}
              borderColor="#7C3AED"
              borderWidth={1}
            >
              <Text color="white">Reactions</Text>
            </Button>
          </XStack>
          <ServiceList type={type} />
        </Card>
      </YStack>
    </ScrollView>
  )
}

