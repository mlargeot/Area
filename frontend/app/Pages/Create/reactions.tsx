import { Button, ScrollView, YStack, H2 } from 'tamagui'
import { useApplet } from '../../context/appletContext'
import { useNavigationData } from '../../context/navigationContext'
import { Link } from 'expo-router'


export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const reactions = [
    {id:"0", name:"On message received"},
    {id:"1", name:"On message sent"},
    {id:"2", name:"On ping"}
  ]
  const { navigationData } = useNavigationData();

  const newReaction = ({id, name} : {id : string, name : string}) => {
    const newId = `reaction-${navigationData.currentService}-${name}`;

    for (let i = 0; i < applet.reactions.length; i++) {
      if (applet.reactions[i].id === newId) {
        alert("Reaction already exists");
        return;
      }
    }

    setApplet(
      {
        id: applet.id,
        action: applet.action,
        reactions: [...applet.reactions, 
          {
            id : newId,
            name: name,
            service: navigationData.currentService
          }
        ]
      }
    )
  }

  const modifyReaction = ({id, name} : {id : string, name : string}) => {
    const newId = `reaction-${navigationData.currentService}-${name}`;

    for (let i = 0; i < applet.reactions.length; i++) {
      if (applet.reactions[i].id === newId) {
        alert("Reaction already exists");
        return;
      }
    }

    setApplet(
      {
        id: applet.id,
        action: applet.action,
        reactions: applet.reactions.map((reaction) => {
          if (reaction.id === navigationData.reactionId) {
            return {
              id: newId,
              name: name,
              service: navigationData.currentService
            }
          }
          return reaction
        })
      }
    )
  }

  return (
    <ScrollView
    contentContainerStyle={{
      flexGrow: 1, 
      backgroundColor: '$background'
    }}
    style={{ flex: 1 }}>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        <H2>{navigationData.currentService}</H2>
        {reactions.flatMap((reaction, i) => [
            <Link key={`button-${reaction.id}`} href="/create" asChild >
                <Button
                    onPress={() => {
                      if (navigationData.actionType === "reaction") {
                        newReaction(reaction)
                      } else {
                        modifyReaction(reaction)
                      }
                    }}
                    width="80%"
                    size={navigationData.currentService === reaction.name ? "$8" : "$6"}
                    >
                    <Button.Text>
                      {reaction.name}
                    </Button.Text>
                </Button>
            </Link>
        ])}
      </YStack>
    </ScrollView>
  )
}
