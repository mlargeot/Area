import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { Text, YStack, XStack, Button, Theme } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FeatureCard = ({ iconName, title, description }) => (
  <YStack
    width="48%"
    borderRadius="$4"
    padding="$3"
    marginBottom="$4"
    backgroundColor="$backgroundSoft"
  >
    <MaterialCommunityIcons
      name={iconName}
      size={32}
      style={{ marginBottom: 8 }}
      color="$color"
    />
    <Text fontSize="$6" fontWeight="600" marginBottom="$2">
      {title}
    </Text>
    <Text fontSize="$3" color="$colorSubtle">
      {description}
    </Text>
  </YStack>
);

export default function Loginmobile() {
  const router = useRouter();

  return (
    <Theme>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flexGrow={1} justifyContent="center" padding="$5">
          <YStack alignItems="center" marginBottom="$6">
            <YStack
              width={96}
              height={96}
              borderRadius="$6"
              justifyContent="center"
              alignItems="center"
              backgroundColor="$backgroundSoft"
            >
              <Text fontSize="$9" fontWeight="bold">
                AR3M
              </Text>
            </YStack>
          </YStack>

          <YStack alignItems="center" marginBottom="$5">
            <Text fontSize="$8" fontWeight="bold" textAlign="center" marginBottom="$3">
              Welcome to AR3M
            </Text>
            <Text fontSize="$5" textAlign="center" color="$colorSubtle">
              Experience the future of Action and Reaction. Join our community
              and start creating amazing experiences.
            </Text>
          </YStack>

          <YStack marginBottom="$6">
            <Button
              onPress={() => router.push('/register')}
              size="$5"
              theme="primary"
            >
              Get Started
            </Button>
            <Text textAlign="center" fontSize="$4" marginTop="$3">
              Already have an account?{' '}
              <Text
                textDecorationLine="underline"
                onPress={() => router.push('/login')}
              >
                Sign In
              </Text>
            </Text>
          </YStack>

          <XStack flexWrap="wrap" justifyContent="space-between">
            <FeatureCard
              iconName="target"
              title="Precise AR"
              description="High accuracy tracking system"
            />
            <FeatureCard
              iconName="rocket"
              title="Fast"
              description="Real-time performance"
            />
            <FeatureCard
              iconName="palette"
              title="Creative"
              description="Unlimited possibilities"
            />
            <FeatureCard
              iconName="account-group"
              title="Community"
              description="Share your creations"
            />
          </XStack>
        </YStack>
      </SafeAreaView>
    </Theme>
  );
}
