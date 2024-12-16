import { Button, ScrollView, TextArea, Label, Switch, Stack, YStack, Text, View, XStack, Square, H2, SizeTokens, Input } from 'tamagui'
import { useNavigationData, NavigationData } from '../../../context/navigationContext';
import { useApplet, Applet, Reaction } from '../../../context/appletContext';
import { Link } from 'expo-router'
import React, { useRef, MutableRefObject, useEffect } from 'react';


const getdefaultValueString = (name : string) => {
  const { applet } = useApplet()
  const { navigationData } = useNavigationData()

  if (navigationData.actionType === "action") {
    for (let i = 0; i < applet.action.params.length; i++) {
      if (applet.action.params[i][name]) {
        return applet.action.params[i][name]
      }
    }
  } else {
    for (let i = 0; i < applet.reactions.length; i++) {
      if (applet.reactions[i].id === navigationData.reactionId) {
        for (let j = 0; j < applet.reactions[i].params.length; j++) {
          if (applet.reactions[i].params[j][name]) {
            return applet.reactions[i].params[j][name]
          }
        }
      }
    }
  }
  return ""
}


const returnField = (
  {type, name} : { type : string, name : string },
  paramsValue: React.MutableRefObject<{name: string; value: string;}[]>) =>{

  const handleInput = (e : any) => {
    paramsValue.current = paramsValue.current.map((param) => {
      if (param.name === name) {
        return {
          name: param.name,
          value: e.target.value
        }
      }
      return param
    });
  }

  const defaultValue : string = getdefaultValueString(name)

  switch (type) {
    case "bool":
      return (
        <SwitchWithLabel size="$4" label={name} defaultChecked />
      )
    case "input":
      handleInput({target: {value: defaultValue}})
      return (
        <InputField name={name} defaultValue={defaultValue} event={handleInput} />
      )
      case "textArea":
      handleInput({target: {value: defaultValue}})
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

function TextAreaField(props: { name: string, defaultValue: string, event: (e : any) => void }) {
  return (
    <XStack gap="$2">
      <Label size="$4">{props.name}</Label>
      <TextArea placeholder="Enter text" defaultValue={props.defaultValue} onChange={(e) => {
        props.event(e)
      }} />
    </XStack>
  )
}

function InputField(props: { name: string, defaultValue: string, event: (e : any) => void }) {
  return (
    <XStack gap="$2">
      <Label size="$4">{props.name}</Label>
      <Input placeholder="Enter text" defaultValue={props.defaultValue} onChange={(e) => {
        props.event(e)
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

const getReactionName = (reactions : {name : string, id : string}[], reactionId : string) => {
  for (let i = 0; i < reactions.length; i++) {
    console.log(reactions[i].id, reactionId)
    if (reactions[i].id === reactionId) {
      return reactions[i].name
    }
  }
  return ""
}

const getReactionService = (reactions : {service : string, id : string}[], reactionId : string) => {
  for (let i = 0; i < reactions.length; i++) {
    if (reactions[i].id === reactionId) {
      return reactions[i].service
    }
  }
  return ""
}

const getParams = ({navigationData, applet} : {navigationData : NavigationData, applet : Applet}) => {
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

  if (navigationData.actionType === "action") {
    return paramDict[applet.action.name]
  } else {
    return paramDict[getReactionName(applet.reactions, navigationData.reactionId)] || []
  }
}

export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const { navigationData } = useNavigationData();
  const params = getParams({navigationData, applet});
  const paramsValue = useRef<{ name: string; value: string }[]>([])

  for (let i = 0; i < params.length; i++) {
    paramsValue.current.push({
      name: params[i].name,
      value: ""
    })
  }

  const saveParams = () => {
    navigationData.actionType !== "action" ?
      setApplet({
        id: applet.id,
        action: applet.action,
        reactions: applet.reactions.map((reaction) => {
          if (reaction.id === navigationData.reactionId) {
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
      :
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
        <Link href={"/Pages/Create/services"}>
          <H2>
            {navigationData.actionType === "action" ? applet.action.service : getReactionService(applet.reactions, navigationData.reactionId)}
          </H2>
        </Link>
        <Link href={`/Pages/Create/${navigationData.actionType === "action" ? "actions" : "reactions"}`}>
          <H2>
            {navigationData.actionType === "action" ? applet.action.name : getReactionName(applet.reactions, navigationData.reactionId)}
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
