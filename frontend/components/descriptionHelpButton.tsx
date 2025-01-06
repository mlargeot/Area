import { Button, AlertDialog, YStack, XStack } from 'tamagui'
import { FileQuestion } from '@tamagui/lucide-icons'
import React from 'react';


export default function DescriptionHelpButton({description, title}: {description: string, title: string}) {
    return (
      <AlertDialog native>
        <AlertDialog.Trigger asChild>
          <Button icon={FileQuestion}></Button>
        </AlertDialog.Trigger>
  
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack gap={0}>
              <AlertDialog.Title>{title}</AlertDialog.Title>
              <AlertDialog.Description>
                {description}
              </AlertDialog.Description>
  
              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button>Ok</Button>
                </AlertDialog.Cancel>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    )
  }
  