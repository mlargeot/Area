import { Stack, Button, YStack, XStack, Text, ScrollView, Card, H1, Paragraph} from 'tamagui';
import { useEffect, useState } from 'react';
import React from 'react';
import { Puzzle, Zap,TestTube, CheckCircle} from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useMedia } from 'tamagui'

export default function GettingStarted() {
  const router = useRouter()
  const media = useMedia();

  return (
    <YStack f={1} bg="$background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <YStack px="$4" gap="$4" alignItems="center">
          <YStack gap="$2">
            <H1>Getting Started with AREM</H1>
            <Paragraph >
              Welcome to AREM! This guide will walk you through the basics of setting up and using our platform.
            </Paragraph>
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
                  <Puzzle size={media.sm ? 20 : 24} color="$blue10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      1. Connect Your Services
                    </Text>
                    <Text fontSize={media.sm ? "$2" : "$3"}>
                      Start by connecting the services you want to use with AREM.
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  <Paragraph size={media.sm ? "$2" : "$3"}>
                    Go to the Services page and connect the services you want to use. This allows AREM to interact with these services on your behalf.
                  </Paragraph>
                  <Button onPress={() => router.push('/services')}>
                    Connect Services
                  </Button>
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
                  <Zap size={media.sm ? 20 : 24} color="$yellow10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      2. Create Your First Action
                    </Text>
                    <Text fontSize={media.sm ? "$2" : "$3"}>
                      Actions are triggers that start your automation.
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  <Paragraph size={media.sm ? "$2" : "$3"} mb="$3">
                    Navigate to the Actions page and select a trigger that will start your integrated automation.
                  </Paragraph>
                  <Button onPress={() => router.push('/create')}>
                    Create Action
                  </Button>
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
            pressStyle={{ scale: 0.9 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                  <Puzzle size={media.sm ? 20 : 24} color="$green10" />
                  <YStack flex={1}>
                    <Text fontSize="$6" fontWeight="bold">3. Set up a Reaction</Text>
                    <Text fontSize="$3">
                      Reactions are the tasks that are performed when an action is triggered.
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  <Paragraph size="$3" mb="$3">
                    Go to the Reactions page, choose a service, and select the action you want to happen when your action occurs.
                  </Paragraph>
                  <Button onPress={() => router.push('/create')}>
                    Set up Reaction
                  </Button>
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
            pressStyle={{ scale: 0.9 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                  <TestTube size={media.sm ? 20 : 24} color="$purple10" />
                  <YStack flex={1}>
                    <Text fontSize="$6" fontWeight="bold">4. Test Your Automation</Text>
                    <Text fontSize="$3">
                      Ensure your action-reaction pair works as expected.
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  <Paragraph size="$3">
                    After setting up your action and reaction, test them to make sure everything works correctly. You can:
                  </Paragraph>
                  <YStack pl="$4" gap="$2">
                    <Text fontSize="$3">• Manually trigger the action</Text>
                    <Text fontSize="$3">• Verify the correct occurrence of the action</Text>
                    <Text fontSize="$3">• Confirm if the reaction occurs as expected</Text>
                  </YStack>
                  <Button onPress={() => router.push('/library')}>
                    Test Automation
                  </Button>
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
            pressStyle={{ scale: 0.9 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                  <CheckCircle size={media.sm ? 20 : 24} color="$green10" />
                  <YStack flex={1}>
                    <Text fontSize="$6" fontWeight="bold">You're All Set!</Text>
                    <Text fontSize="$3">
                      Ensure your action-reaction pair works as expected.
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  <Paragraph size="$3">
                    Congratulations! You've completed the getting started guide. Check out our other guides for more advanced features and tips.
                  </Paragraph>
                  <Button onPress={() => router.push('/helpcenter')}>
                    View all guides
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
