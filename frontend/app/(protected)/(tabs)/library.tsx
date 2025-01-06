import { ExternalLink } from '@tamagui/lucide-icons'
import { Anchor, H2, Paragraph, XStack, YStack } from 'tamagui'
import React from 'react'
import { useAppletList } from '../../../context/appletListContext'

export default function LibraryScreen() {
  const { appletList } = useAppletList();

  console.log(appletList);

  return (
    <YStack f={1} ai="center" gap="$8" px="$10" pt="$5" bg="$background">
      <H2>Library</H2>

    </YStack>
  )
}
