import { Stack, Button, YStack, XStack, Text, ScrollView, Card, H1, Paragraph} from 'tamagui';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import React from 'react';
import { Info, CheckCircle, Play, Bolt } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useMedia } from 'tamagui'

const services = [
  { name: 'Discord', color: '#5865F2', isActive: true, description:"This is the documentation of reaction and actions discord."},
  { name: 'Spotify', color: '#1DB954', isActive: false, description:""},
  { name: 'Twitch', color: '#9146FF', isActive: true, description:""},
  { name: 'X', color: '#1DA1F2', isActive: false, description:""},
  { name: 'Google', color: '#FF0000', isActive: true, description:""},
  { name: 'Github', color: '#333333', isActive: false, description:"GitHub is a web-based hosting service for version control using Git. It  is mostly used for computer code. It offers all of the distributed  version control and source code management (SCM) functionality of Git as well as adding its own features."},
];

const Actions = [
    { name: 'New push', description1:"Triggered when a new commit is pushed to a specified repository."},
    { name: 'Merge', description1:"Make a merge."},
];

const Reactions = [
    { name: 'New message', description1:"Send a new message."},
    { name: 'New channel', description1:"Create a new channel."},
];

export default function GeneralHelp({title}: any) {
  const router = useRouter()
  const media = useMedia();
  const service = services.find((s) => s.name === title);

  return (
    <YStack f={1} bg="$background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <YStack px="$4" gap="$4" alignItems="center">
          <YStack gap="$2">
            <H1>Getting Started with {title}</H1>
          </YStack>

          <Card
            elevate
            bordered
            width={media.sm ? '90%' : '50%'}
            animation="bouncy"
            scale={0.9}
            pressStyle={{ scale: 0.95 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                <Info size={24} color="$blue10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      About {service?.name}
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  <Paragraph size={media.sm ? "$2" : "$3"}>
                  {service?.description}
                  </Paragraph>
                </YStack>
              </Card.Footer>
            </YStack>
          </Card>

          <Card
            elevate
            bordered
            width={media.sm ? '90%' : '50%'}
            animation="bouncy"
            scale={0.9}
            pressStyle={{ scale: 0.95 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                <Play size={24} color="$blue10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      Available Actions
                    </Text>
                    <Text fontSize={media.sm ? "$2" : "$3"}>
                      Actions are events on {service?.name} that can trigger a reaction in AREA.
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  {Actions.map((Action, index) => (
                      <YStack key={index} width="100%">
                      {index !== 0 && (
                        <YStack
                          borderTopWidth={1}
                          borderTopColor="$gray5"
                          width="100%"
                          marginVertical="$2"
                        />
                      )}
                      <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                        {Action?.name}
                      </Text>
                      <Text fontSize={media.sm ? "$2" : "$3"}>
                        {Action?.description1}
                      </Text>
                    </YStack>
                    ))}
                </YStack>
              </Card.Footer>
            </YStack>
          </Card>

          <Card
            elevate
            bordered
            width={media.sm ? '90%' : '50%'}
            animation="bouncy"
            scale={0.9}
            pressStyle={{ scale: 0.95 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                <Bolt size={24} color="$yellow10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      Available Reactions
                    </Text>
                    <Text fontSize={media.sm ? "$2" : "$3"}>
                      Reactions are actions that AREA can perform on {service?.name} in response to a trigger.
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  {Reactions.map((Reaction, index) => (
                      <YStack key={index} width="100%">
                      {index !== 0 && (
                        <YStack
                          borderTopWidth={1}
                          borderTopColor="$gray5"
                          width="100%"
                          marginVertical="$2"
                        />
                      )}
                      <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                        {Reaction?.name}
                      </Text>
                      <Text fontSize={media.sm ? "$2" : "$3"}>
                        {Reaction?.description1}
                      </Text>
                    </YStack>
                    ))}
                </YStack>
              </Card.Footer>
            </YStack>
          </Card>

          <Card
            elevate
            bordered
            width={media.sm ? '90%' : '50%'}
            animation="bouncy"
            scale={0.9}
            pressStyle={{ scale: 0.95 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                <CheckCircle size={24} color="$green10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      Available Actions
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  <Paragraph size={media.sm ? "$2" : "$3"}>
                    Now that you're familiar with the {service?.name} integration, you can start  creating powerful automations. 
                  </Paragraph>
                  <Button onPress={() => router.push('/create')}>
                    Create Applet
                  </Button>
                </YStack>
              </Card.Footer>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
