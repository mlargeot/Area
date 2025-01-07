import { H2, XStack, YStack } from 'tamagui'
import React, { useEffect } from 'react'
import { useAppletList } from '../../../context/appletListContext'
import { Link } from 'expo-router';
import { useApplet } from '../../../context/appletContext';


export default function LibraryScreen() {
  const { appletList, fetchData } = useAppletList();
  const { setApplet } = useApplet();

  useEffect(() => {
    fetchData && fetchData();
  }, []);

  return (
    <YStack f={1} ai="center" gap="$8" px="$10" pt="$5" bg="$background">
      <H2>Library</H2>

      <YStack f={1} gap="$4" w="100%">
        {appletList.map((applet, i) => (
          <Link key={i} href="/create" asChild>
            <XStack onPress={() => {setApplet(applet)}} key={i} gap="$4" w="100%" p="$4" bg="$surface">
              <YStack f={1} gap="$2">
                <H2>{applet.appletId}</H2>
              </YStack>
            </XStack>
          </Link>
        ))}
      </YStack>
    </YStack>
  )
}
