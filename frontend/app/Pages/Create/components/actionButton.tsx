import { Button, Stack, YStack, Text, XStack } from 'tamagui';
import { Link } from 'expo-router';
import { useNavigationData } from '../../../context/navigationContext';
import { useApplet } from '../../../context/appletContext';

export function ActionButton({ index } : { index : number }) {
  const { setNavigationData } = useNavigationData();
  const { applet } = useApplet();

  return (
    <Link href="/Pages/Create/services" asChild>
      <Button
      onPress={() => {setNavigationData({
        currentService: applet.action.service,
        actionType: "action",
        id: applet.action.id ? applet.action.id : ""
      })}}
      borderWidth="$1"
      borderColor="$color"
      padding="$3"
      borderRadius="$2"
      borderStyle='dotted'
      height="fit-content"
      width="80%"
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
              <Button.Text>{applet.action.service ? applet.action.service : "Trigger"}</Button.Text>
            </Stack>
          </XStack>
          <Button.Text
            opacity={0.60}
          >{index.toString()}. { applet.action.name ? applet.action.name : " Select the event that start the workflow"}</Button.Text>
        </YStack>
      </Button>
    </Link>
  )
}
