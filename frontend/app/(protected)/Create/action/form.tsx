import { Button, ScrollView, TextArea, Label, Switch, Stack, YStack, Text, View, XStack, Square, H2, SizeTokens, Input } from 'tamagui'
import { useApplet, Applet, getParamValueString } from '../../../../context/appletContext';
import { Link } from 'expo-router'
import React, { useRef } from 'react';

const returnField = (
  {type, name} : { type : string, name : string },
  paramsValue: React.MutableRefObject<{name: string; value: string;}[]>
) =>{
  const { applet } = useApplet();
  const defaultValue : string = getParamValueString(name, applet.action)

  const handleInput = (val : string) => {
    paramsValue.current = paramsValue.current.map((param) => {
      if (param.name === name) {
        return {
          name: param.name,
          value: val
        }
      }
      return param
    });
  }


  switch (type) {
    case "bool":
      return (
        <SwitchWithLabel size="$4" label={name} defaultChecked />
      )
    case "input":
      handleInput(defaultValue)
      return (
        <InputField name={name} defaultValue={defaultValue} event={handleInput} />
      )
      case "textArea":
      handleInput(defaultValue)
      return (
        <TextAreaField defaultValue={defaultValue} name={name} event={handleInput} />
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

function TextAreaField(props: { name: string, defaultValue: string, event: (val : string) => void }) {
  return (
    <XStack gap="$2">
      <Label size="$4">{props.name}</Label>
      <TextArea placeholder="Enter text" defaultValue={props.defaultValue} onChangeText={(val) => {
        props.event(val)
      }} />
    </XStack>
  )
}

function InputField(props: { name: string, defaultValue: string, event: (val : string) => void }) {
  return (
    <XStack gap="$2">
      <Label size="$4">{props.name}</Label>
      <Input placeholder="Enter text" defaultValue={props.defaultValue} onChangeText={(val) => {
        props.event(val)
      }} />
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

const getParams = (applet : Applet) => {
  const paramDict: { [key: string]: { type: string; name: string; }[] } = {
    "pr_assigned": [
      {type: "input", name: "email"},
      {type: "input", name: "githubRepoUrl"},
    ],
    "send_webhook_message": [
      {type: "input", name: "url"},
      {type: "input", name: "content"},
    ]
  }

  return paramDict[applet.action.name]
}

export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const params = getParams(applet);
  const paramsValue = useRef<{ name: string; value: string }[]>([])

  for (let i = 0; i < params.length; i++) {
    paramsValue.current.push({
      name: params[i].name,
      value: ""
    })
  }

  const saveParams = () => {
    setApplet({
      id: applet.id,
      action: {
        service: applet.action.service,
        name: applet.action.name,
        id: applet.action.id,
        params: paramsValue.current.map((param) => {
          return {
            [param.name]: param.value
          }
        })
      },
      reactions: applet.reactions
    })
  }

  return (
    <ScrollView>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        <Link href={"/Create/services"}>
          <H2>
            {applet.action.service}
          </H2>
        </Link>
        <Link href={`/Create/action/effect`}>
          <H2>
            {applet.action.name}
          </H2>
        </Link>
        {params.map((param, i) => [
          <View key={`field-${i}-${param.type}`} >
            {returnField(param, paramsValue)}
          </View>
        ])}
        <Link href="/create" asChild>
          <Button onPress={saveParams}>
            <Button.Text>
              Save
            </Button.Text>
          </Button>
        </Link>
      </YStack>
    </ScrollView>
  )
}
