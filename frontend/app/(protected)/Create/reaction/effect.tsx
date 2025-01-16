import React, { useRef } from 'react'
import { 
  ScrollView, YStack, XStack, Card, H1, Text, Button, 
  Image, AnimatePresence, Paragraph
} from 'tamagui'
import { useApplet, Applet } from '../../../../context/appletContext'
import { useServiceList } from '../../../../context/serviceListContext'
import { useNavigationData } from '../../../../context/navigationContext'
import { Link } from 'expo-router'
import { ChevronLeft, Workflow, ArrowRight } from '@tamagui/lucide-icons'
import { useMedia } from 'tamagui'

const getCurrentReactionName = (applet: Applet, reactionId: string): string => {
  return applet.reactions.find(reaction => reaction._id === reactionId)?.name || ""
}

export default function ReactionEffectsScreen() {
  const { applet, setApplet } = useApplet()
  const { serviceReactionList } = useServiceList()
  const { navigationData, setNavigationData } = useNavigationData()
  const currentService = navigationData.currentService
  const actionType = navigationData.actionType
  const reactionId = navigationData.reactionId
  const reactions = serviceReactionList.find(
    (service) => service.service.toLowerCase() === currentService.toLowerCase()
  )?.effect || []

  const media = useMedia();

  const idIndex = useRef<number>(0)

  const newReaction = ({ name }: { name: string }) => {
    let newId = `${idIndex.current}`
    while (applet.reactions.some(reaction => reaction._id === newId)) {
      idIndex.current++
      newId = `${idIndex.current}`
    }

    setApplet({
      ...applet,
      reactions: [
        ...applet.reactions,
        {
          _id: newId,
          name: name,
          service: currentService,
          params: []
        }
      ]
    })

    setNavigationData({
      currentService: currentService,
      actionType: actionType,
      reactionId: newId
    })
  }

  const modifyReaction = (name: string) => {
    if (applet.reactions.some(reaction => reaction.name === name)) return

    setApplet({
      ...applet,
      reactions: applet.reactions.map((reaction) =>
        reaction._id === reactionId
          ? { ...reaction, name: name, service: currentService, params: [] }
          : reaction
      )
    })
  }

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
              <Button icon={ChevronLeft} circular size="$3" backgroundColor="$purple8" />
            </Link>
            <H1 color="$purple10" fontWeight="bold">{currentService}</H1>
            <Workflow size={24} color="$purple10" />
          </XStack>
        </Card>

        <Text fontSize="$6" fontWeight="bold" textAlign="center">
          Choose a reaction
        </Text>

        <YStack space="$2">
          <AnimatePresence>
            {reactions.map((reaction, i) => (
              <Card
                key={`reaction-${i}`}
                borderRadius="$4"
                padding="$4"
                marginBottom="$2"
                animation="quick"
                enterStyle={{ opacity: 0, scale: 0.9 }}
                exitStyle={{ opacity: 0, scale: 0.9 }}
                pressStyle={{ scale: 0.97 }}
                elevate
              >
                <Link href="/Create/reaction/form" asChild>
                  <Button
                    onPress={() => {
                      if (actionType === "reaction") {
                        newReaction(reaction)
                      } else {
                        modifyReaction(reaction.name)
                      }
                    }}
                    hoverStyle={{
                      backgroundColor: "$purple10",
                      scale: 1.01,
                    }}
                    height="auto"
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
                        <YStack flex={1} textAlign="center">
                          <Text 
                            fontSize="$5"
                            fontWeight="bold"
                          >
                            {reaction.name}
                          </Text>
                          <Paragraph size={media.sm ? "$2" : "$3"}>
                            {reaction.description || "Déclenche une réaction spécifique"}
                          </Paragraph>
                        </YStack>
                      </XStack>
                      <ArrowRight size={20} color="$purple10" />
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

