import { Button, Stack, YStack, Text, XStack } from 'tamagui'

export function EventButton({ index } : { index : number }) {
  return (
        <Button
          borderWidth="$1"
          borderColor="$color"
          padding="$3"
          borderRadius="$2"
          borderStyle='dotted'
          height="fit-content"
          width="100%"
          justifyContent='flex-start'
          >
          <YStack gap="$2">
            <XStack gap="$2">
              <Stack
                borderWidth="$1"
                borderColor="$color"
                padding="$2"
                borderRadius="$2"
              >
                <Text>Trigger</Text>
              </Stack>
            </XStack>
            <Text
              opacity={0.60}
            >{index}. Select the event that start the workflow</Text>
          </YStack>
        </Button>
  )
}
