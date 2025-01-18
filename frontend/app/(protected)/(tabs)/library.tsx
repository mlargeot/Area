import { H2, XStack, YStack, Text,Card, Paragraph, Button, Spinner  } from 'tamagui'
import React, { useEffect } from 'react'
import { useAppletList } from '../../../context/appletListContext'
import { Link } from 'expo-router';
import { useApplet } from '../../../context/appletContext';
import { ChevronRight, Activity, Zap } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router';


export default function LibraryScreen() {
  const { appletList, fetchData } = useAppletList();
  const { setApplet } = useApplet();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <YStack f={1} ai="center" px="$4" pt="$5" bg="$background">
      <H2 mb="$4">My Applets</H2>

      {appletList.length === 0 ? (
        <Card elevate bordered p="$4" w="100%" maxWidth={600}>
          <Paragraph ta="center">You haven't created any applets yet.</Paragraph>
          <Button mt="$4" als="center" onPress={() => router.push({ pathname: '/create'})}>Create Your First Applet</Button>
        </Card>
      ) : (
        <YStack gap="$4" w="100%" maxWidth={600}>
          {appletList.map((applet, i) => (
            <Link key={i} href="/create" asChild>
              <Card
                elevate
                bordered
                animation="bouncy"
                scale={0.97}
                hoverStyle={{ scale: 1 }}
                pressStyle={{ scale: 0.95 }}
                onPress={() => setApplet(applet)}
              >
                <Card.Header padded>
                  <H2>{applet.name}</H2>
                </Card.Header>
                <Card.Footer padded>
                  <XStack jc="space-between" ai="center" w="100%">
                    <XStack ai="center" gap="$2">
                      <Activity size={18} color="$blue10" />
                      <Text color="$blue10">{applet.action.service}</Text>
                    </XStack>
                    <ChevronRight size={18} color="$gray10" />
                    <XStack ai="center" gap="$2">
                      <Zap size={18} color="$orange10" />
                      <Text color="$orange10">{applet.reactions[0].service}</Text>
                    </XStack>
                  </XStack>
                </Card.Footer>
              </Card>
            </Link>
          ))}
        </YStack>
      )}
    </YStack>
  )
}
