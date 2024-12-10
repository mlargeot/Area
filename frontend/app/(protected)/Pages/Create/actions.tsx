import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square, H2 } from 'tamagui'
import { useNavigationData } from '../../../context/navigationContext'
import { Link } from 'expo-router'
import { useApplet } from '../../../context/appletContext';


export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const actions = [
    {id:"0", name:"On message received"},
    {id:"1", name:"On message sent"},
    {id:"2", name:"On ping"}
  ]
  const { navigationData } = useNavigationData();

  return (
    <ScrollView
    contentContainerStyle={{
      flexGrow: 1, 
      backgroundColor: '$background'
    }}
    style={{ flex: 1 }}>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        <H2>{navigationData.currentService}</H2>
        {actions.flatMap((action, i) => [
            <Link key={`button-${action.id}`} href="/create" asChild >
                <Button
                    onPress={() => {setApplet(
                      {
                        action: {
                          service: navigationData.currentService,
                          name: action.name,
                          id: `action-${actions.length.toString()}`
                        },
                        reactions: applet.reactions,
                        id: applet.id
                      }
                      )
                    }}
                    width="80%"
                    size={applet.action.name === action.name ? "$8" : "$6"}
                    >
                    <Button.Text>
                    {action.name}
                    </Button.Text>
                </Button>
            </Link>
        ])}
      </YStack>
    </ScrollView>
  )
}
