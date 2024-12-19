import { Button, ScrollView, TextArea, Label, Switch, Stack, YStack, Text, View, XStack, Square, H2, SizeTokens, Input } from 'tamagui'
import { storage } from '../../../../context/navigationContext';
import { useApplet, Reaction, emptyReaction, getParamValueString } from '../../../../context/appletContext';
import { Link } from 'expo-router'
import React, { useEffect, useRef } from 'react';


const returnField = (
  {type, name} : { type : string, name : string },
  paramsValue: React.MutableRefObject<{name: string; value: string;}[]>,
  reaction: Reaction
  ) =>{

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

  const defaultValue : string = getParamValueString(name, reaction)

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
  const id = `switch-${props.label}`
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

const getReaction = (reactionId: string, reactions: Reaction[]): Reaction => {
  for (let i = 0; i < reactions.length; i++) {
    if (reactions[i].id === reactionId) {
      return reactions[i];
    }
  }
  return emptyReaction();
}

const getParams = (reactionName : string) => {
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

  return paramDict[reactionName]
}

export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const reactionId = storage.getString("reactionId") || "";
  const reaction : Reaction = getReaction(reactionId, applet.reactions)
  const params = getParams(reaction.name);
  const paramsValue = useRef<{ name: string; value: string }[]>([])

  useEffect(() => {
    for (let i = 0; i < params.length; i++) {
      paramsValue.current.push({
        name: params[i].name,
        value: ""
      })
    }
  }, [])

  const saveParams = () => {
    setApplet({
      id: applet.id,
      action: applet.action,
      reactions: applet.reactions.map((reaction) => {
        if (reaction.id === reactionId) {
          return {
            id: reaction.id,
            name: reaction.name,
            service: reaction.service,
            params: paramsValue.current.map((param) => {
              return {
                [param.name]: param.value
              }
            })
          }
        }
        return reaction
      })
    })
  }

  return (
    <ScrollView>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        <Link href={"/Create/services"} onPress={() => {
            storage.set("actionType", "reaction");
          }}>
          <H2>
            {reaction.service}
          </H2>
        </Link>
        <Link href={"/Create/reaction/effect"} onPress={() => {
            storage.set("actionType", "modify");
          }}>
          <H2>
            {reaction.name}
          </H2>
        </Link>
        {params.map((param, i) => [
          <View key={`field-${i}-${param.type}`} >
            {returnField(param, paramsValue, reaction)}
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
