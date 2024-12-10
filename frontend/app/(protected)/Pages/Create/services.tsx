import { Button, ScrollView, YStack, } from 'tamagui'
import { Link } from 'expo-router'
import { useNavigationData } from '../../../context/navigationContext'
import { useApplet } from '../../../context/appletContext';


export default function ServicesScreen() {
  const services = [
    {id:"0", name:"Discord"},
    {id:"1", name:"Google"},
    {id:"2", name:"Twitch"},
    {id:"3", name:"Github"},
    {id:"4", name:"Spotify"},
    {id:"5", name:"Microsoft"},
  ]
  const { navigationData, setNavigationData } = useNavigationData();
  const { applet, setApplet } = useApplet();

  const resetAction = (serviceName : string) => {
    if (applet.action.service !== serviceName) {
      setApplet({
        action: {
          service: "",
          name: "",
          id: ""
        },
        reactions: applet.reactions,
        id: applet.id
    })
  }}

  const selectPage = () => {
    if (navigationData.actionType === "reaction" ||
        navigationData.actionType === "modify") {
      return "/Pages/Create/reactions";
    }
    return "/Pages/Create/actions";
  }

  return (
    <ScrollView
    contentContainerStyle={{
      flexGrow: 1,
      backgroundColor: '$background'
    }}
    style={{ flex: 1 }}>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        {services.flatMap((a, i) => [
          <Link key={`button-${i}`} href={selectPage()} asChild>
            <Button
              onPress={() => {
                setNavigationData({
                  currentService: a.name,
                  actionType: navigationData.actionType,
                  reactionId: navigationData.reactionId}
                );
                resetAction(a.name);
              }}
              width="80%"
              size={navigationData.currentService === a.name ? "$8" : "$6"}
              >
              <Button.Text>
                {a.name}
              </Button.Text>
            </Button>
          </Link>
        ])}
      </YStack>
    </ScrollView>
  )
}
