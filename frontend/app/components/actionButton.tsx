import { Button, Stack, YStack, Text, XStack } from 'tamagui'

export function ActionButton({ index, action } : { index : number, action : any }) {
  return (
    <Button
    onPress={action}
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
            <Button.Text>Action</Button.Text>
          </Stack>
        </XStack>
        <Text
          opacity={0.60}
        >{index.toString()}. Select the event to run</Text>
      </YStack>
    </Button>
  )
}
