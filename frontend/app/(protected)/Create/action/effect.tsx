import React from 'react'
import { 
  ScrollView, YStack, XStack, Card, H1, Text, Button, 
  Image, AnimatePresence 
} from 'tamagui'
import { useNavigationData } from '../../../../context/navigationContext'
import { Link } from 'expo-router'
import { useApplet } from '../../../../context/appletContext'
import { useServiceList } from '../../../../context/serviceListContext'
import { ChevronLeft, Zap, ArrowRight } from '@tamagui/lucide-icons'

export default function ActionEffectsScreen() {
  const { applet, setApplet } = useApplet()
  const { serviceActionList } = useServiceList()
  const { navigationData } = useNavigationData()
  const currentService = navigationData.currentService
  const actions = serviceActionList.find(
    (service) => service.service.toLowerCase() === currentService.toLowerCase()
  )?.effect || []

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1, 
      }}
      style={{ flex: 1 }}
    >
      <YStack padding="$4" space="$4">
        <Card borderRadius="$4" padding="$4" elevate>
          <XStack justifyContent="space-between" alignItems="center">
            <Link href="/Create/services" asChild>
              <Button icon={ChevronLeft} circular size="$3" backgroundColor="$blue8" />
            </Link>
            <H1 color="$blue10" fontWeight="bold">{currentService}</H1>
            <Zap size={24} color="$blue10" />
          </XStack>
        </Card>

        <Text color="white" fontSize="$6" fontWeight="bold" textAlign="center">
          Choisissez une Action
        </Text>

        <YStack space="$2">
          <AnimatePresence>
            {actions.map((action, i) => (
              <Card
                key={`action-${i}`}
                borderRadius="$4"
                padding="$4"
                marginBottom="$2"
                animation="quick"
                enterStyle={{ opacity: 0, scale: 0.9 }}
                exitStyle={{ opacity: 0, scale: 0.9 }}
                pressStyle={{ scale: 0.97 }}
                elevate
              >
                <Link href="/Create/action/form" asChild>
                  <Button
                    onPress={() => {
                      action.name !== applet.action.name && setApplet({
                        ...applet,
                        action: {
                          service: currentService,
                          name: action.name,
                          _id: `action-${actions.length.toString()}`,
                          params: []
                        }
                      })
                    }}
                    hoverStyle={{
                      backgroundColor: "$blue10",
                      scale: 1.01,
                    }}
                    paddingVertical="$2"
                    animation="quick"
                  >
                    <XStack flex={1} alignItems="center" justifyContent="space-between">
                      <XStack space="$3" alignItems="center" flex={1}>
                        <Image 
                          source={{ uri: '/placeholder.svg?height=40&width=40' }}
                          width={40} 
                          height={40} 
                          borderRadius="$2"
                        />
                        <YStack>
                        <Text 
                            fontSize="$5"
                            fontWeight="bold"
                          >
                            {action.name}
                          </Text>
                          <Text fontSize="$3">
                            {action.description || "Déclenche une action spécifique"}
                          </Text>
                        </YStack>
                      </XStack>
                      <ArrowRight size={20} color="$blue10" />
                    </XStack>
                  </Button>
                </Link>
              </Card>
            ))}
          </AnimatePresence>
        </YStack>
      </YStack>
    </ScrollView>
  )
}

