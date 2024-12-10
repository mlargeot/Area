import { Button, Stack, YStack, Text, XStack } from 'tamagui';
import { Link } from 'expo-router';
import { useNavigationData } from '../../../context/navigationContext';
import { Reaction } from "../../../context/appletContext";


export function ReactionButton({ index, reaction } : { index : number, reaction: Reaction }) {
  const { setNavigationData } = useNavigationData();

  return (
    <Link href="/Pages/Create/services" asChild>
      <Button
      onPress={() => {
        setNavigationData({
          currentService: reaction.service ? reaction.service : "",
          actionType: !reaction.service ? "reaction" : "modify",
          id: reaction.id ? reaction.id : ""
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
              <Button.Text>{reaction.service !== "" ? reaction.service : 'Reaction'}</Button.Text>
            </Stack>
          </XStack>
          <Text
            opacity={0.60}
          >{index.toString()}. { reaction.name ? reaction.name : "Select the reaction"}</Text>
        </YStack>
      </Button>
    </Link>
  )
}
