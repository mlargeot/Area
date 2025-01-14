import { H2, XStack, YStack, Text } from 'tamagui'
import React, { useEffect } from 'react'
import { useAppletList } from '../../../context/appletListContext'
import { Link } from 'expo-router';
import { useApplet } from '../../../context/appletContext';


export default function LibraryScreen() {
  const { appletList, fetchData } = useAppletList();
  const { setApplet } = useApplet();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <YStack f={1} ai="center" gap="$8" px="$10" pt="$5" bg="$background">
      <H2>Library</H2>

      <YStack f={1} gap="$4" w="100%">
        {appletList.map((applet, i) => (
          <Link key={i} href="/create" asChild>
            <XStack onPress={() => {setApplet(applet)}} key={i} gap="$4" w="100%" p="$4" bg="$surface" alignItems='center'>
              <H2>{applet.name}</H2>
              <Text>Action :{applet.action.service}</Text>
              <Text>Reaction :{applet.reactions[0].service}</Text>
            </XStack>
          </Link>
        ))}
      </YStack>
    </YStack>
  )
}
