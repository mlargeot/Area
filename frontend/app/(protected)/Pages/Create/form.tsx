import { Button, ScrollView, TextArea, Label, Switch, Stack, YStack, Text, View, XStack, Square, H2, SizeTokens, Input } from 'tamagui'
import { useNavigationData } from '../../../context/navigationContext';
import { useApplet } from '../../../context/appletContext';
import { Link } from 'expo-router'


const returnField = ({type, name} : { type : string, name : string }) => {

  switch (type) {
    case "bool":
      return (
        <SwitchWithLabel size="$4" label={name} defaultChecked />
      )
    case "input":
      return (
        <InputField name={name} />
      )
    case "textArea":
      return (
        <TextAreaField name={name} />
      )
    case "date":
      return (
        <DateField name={name} />
      )
    case "number":
      return (
        <NumberField name={name} />
      )
    default:
      return (
        <Text>{name}</Text>
      )
  }
}

const toggleSwitch = (value: boolean) => {
  console.log(value)
}

function DateField(props: { name: string }) {
  return (
    <XStack gap="$2">
      <Label size="$4">{props.name}</Label>
      <Text>WORK IN PROGRESS</Text>
    </XStack>
  )
}

function NumberField(props: { name: string }) {
  return (
    <XStack gap="$2">
      <Label size="$4">{props.name}</Label>
      <Input keyboardType="numeric" placeholder="Enter number" />
    </XStack>
  )
}

function TextAreaField(props: { name: string }) {
  return (
    <XStack gap="$2">
      <Label size="$4">{props.name}</Label>
      <TextArea placeholder="Enter text" />
    </XStack>
  )
}

function InputField(props: { name: string }) {
  return (
    <XStack gap="$2">
      <Label size="$4">{props.name}</Label>
      <Input placeholder="Enter text" />
    </XStack>
  )
}

function SwitchWithLabel(props: { size: SizeTokens; label: string; defaultChecked?: boolean }) {
  const id = `switch-${props.size.toString().slice(1)}-${props.defaultChecked ?? ''}`
  return (
    <XStack alignItems="center" gap="$2">
      <Label htmlFor={id} size="$4">
        {props.label}
      </Label>
      <Switch
        id={id}
        size={props.size}
        defaultChecked={props.defaultChecked}
        onCheckedChange={toggleSwitch}
        >
        <Switch.Thumb animation="quick" />
      </Switch>
    </XStack>
  )
}


export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const params = [
    {type:"bool",     name:"bool input"},
    {type:"input",    name:"normal text input"},
    {type:"textArea", name:"long text input"},
    {type:"date",     name:"date input"},
    {type:"number",   name:"number input"},
  ]
  const { navigationData } = useNavigationData();

  return (
    <ScrollView>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        {params.map((param, i) => [
          <View key={`field-${i}-${param.type}`} >
            {returnField(param)}
          </View>
        ])}
      </YStack>
    </ScrollView>
  )
}
