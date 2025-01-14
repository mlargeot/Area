import React from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { TamaguiProvider, Theme, YStack, XStack, Text, Button, Card, H1, H2, Paragraph } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Mail, Bell, Smartphone, Clock, Calendar, ArrowRight, Zap } from '@tamagui/lucide-icons'

const features = [
    {
      title: "Getting Started",
      description: "Learn how to create your first action-reaction pair with our easy step-by-step guide.",
      color: '$gray10',
      borderColor: "border-gray-700",
      buttonColor: "bg-gray-700 hover:bg-gray-600",
      icon: ArrowRight
    },
    {
      title: "Example Applet",
      description: "When an important email arrives (Action) → Send a mobile notification (Reaction). Try our interactive demo below!",
      color: '$purple10',
      borderColor: "border-purple-500",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      icon: Zap
    },
    {
      title: "How It Works",
      description: "1. Choose an action (trigger) from various apps. 2. Select a reaction (what happens). 3. We handle the automation for you!",
      color: '$blue10',
      borderColor: "border-blue-500",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      icon: Clock
    },
    {
      title: "Popular Actions",
      description: "Email received, Time of day, Weather changes, Social media updates, Calendar events",
      color: '$green10',
      borderColor: "border-green-500",
      buttonColor: "bg-green-500 hover:bg-green-600",
      icon: Mail
    },
    {
      title: "Popular Reactions",
      description: "Send notifications, Update spreadsheets, Post to social media, Control smart home devices, Add tasks to your to-do list",
      color: '$yellow10',
      borderColor: "border-yellow-500",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      icon: Bell
    },
    {
      title: "Why Use Our Platform",
      description: "Save time, reduce errors, and automate your digital life. Connect your favorite apps and services effortlessly.",
      color: '$red10',
      borderColor: "border-red-500",
      buttonColor: "bg-red-500 hover:bg-red-600",
      icon: Smartphone
    }
  ]

export default function Loginweb() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1}}>
            <YStack padding="$4" gap="$4">
                <H1 textAlign="center">Welcome to Arem</H1>
                <Paragraph textAlign="center">
                    Automate your digital life with powerful action-reaction pairs. 
                    Connect your apps and services to create custom Applet - no coding required!
                </Paragraph>

                <YStack gap="$4" alignItems="center" >
                    <XStack
                        flexWrap="wrap"
                        justifyContent="center"
                        gap="$4"
                        width="100%"
                    >
                    {features.map((feature, index) => (
                    <Card key={index} elevate size="$4" borderWidth={2} borderColor={feature.color} width="25%">
                        <Card.Header padded>
                        <XStack gap="$2" alignItems="center">
                            <feature.icon size="$1" color={feature.color}/>
                            <H2>{feature.title}</H2>
                        </XStack>
                        </Card.Header>
                        <Card.Footer padded>
                        <YStack gap="$3" width="100%" alignItems="flex-start">
                            <Paragraph>{feature.description}</Paragraph>
                            <Button
                                bg={feature.color}
                                marginTop="$2"
                                onPress={() => router.push('/login')}
                            >
                                Read more
                            </Button>
                        </YStack>
                        </Card.Footer>
                    </Card>
                    ))}
                    </XStack>
                </YStack>

                <YStack alignItems="center">
                    <Button
                        size="$6"
                        icon={ArrowRight}
                        onPress={() => router.push('/login')}
                    >
                        Create Your First Applet
                    </Button>
                </YStack>

                <YStack gap="$4">
                    <H2 textAlign="center">Try Our Example Applet</H2>
                    <Card elevate size="$4">
                    <Card.Header padded>
                        <YStack gap="$4" alignItems="center">
                        <XStack gap="$4" alignItems="center">
                            <YStack alignItems="center">
                            <Mail size="$8" />
                            <H2 marginTop="$2">Action</H2>
                            <Paragraph theme="alt2">Receive an important email</Paragraph>
                            </YStack>
                            <Zap size="$6" />
                            <YStack alignItems="center">
                            <Bell size="$8" />
                            <H2 marginTop="$2">Reaction</H2>
                            <Paragraph theme="alt2">Get a mobile notification</Paragraph>
                            </YStack>
                        </XStack>
                        </YStack>
                    </Card.Header>
                    </Card>
                </YStack>
            </YStack>
    </SafeAreaView>
  );
}
