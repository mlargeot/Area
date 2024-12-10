import { Button, ScrollView, Stack, YStack, Text, View, XStack, Square, H2 } from 'tamagui'
import { useNavigationData } from '../../../context/navigationContext'
import { Link } from 'expo-router'
import { useApplet } from '../../../context/appletContext';


export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const params = [
    {id:"0", name:"On message received"},
    {id:"1", name:"On message sent"},
    {id:"2", name:"On ping"}
  ]
  const { navigationData } = useNavigationData();

  return (
    <ScrollView>
    </ScrollView>
  )
}
