import { Button, ScrollView, TextArea, Label, Switch, Stack, YStack, Text, View, XStack, Square, H2, SizeTokens, Input } from 'tamagui'
import { useNavigationData } from '../../../../context/navigationContext';
import { useApplet, Reaction, emptyReaction, getParamValueString } from '../../../../context/appletContext';
import { useServiceList, Params } from '../../../../context/serviceListContext';
import { Link } from 'expo-router'
import React, { useEffect, useRef } from 'react';
import DescriptionHelpButton from '../../../../components/descriptionHelpButton';


const returnField = (
  paramTemplate : Params,
  paramsValue: React.MutableRefObject<{name: string; value: string;}[]>,
  reaction: Reaction
  ) =>{

  const handleInput = (val : string) => {
    paramsValue.current = paramsValue.current.map((param) => {
      if (param.name === paramTemplate.name) {
        return {
          name: param.name,
          value: val
        }
      }
      return param
    });
  }

  const defaultValue : string = getParamValueString(paramTemplate.name, reaction)

  switch (paramTemplate.type) {
    case "bool":
      return (
        <SwitchWithLabel size="$4" label={paramTemplate.name} defaultChecked />
      )
    case "input":
      handleInput(defaultValue)
      return (
        <InputField name={paramTemplate.name} defaultValue={defaultValue} event={handleInput} />
      )
      case "string":
      handleInput(defaultValue)
      return (
        <TextAreaField defaultValue={defaultValue} param={paramTemplate} event={handleInput} />
      )
    case "date":
      return (
        <DateField name={paramTemplate.name} />
      )
    case "number":
      return (
        <NumberField name={paramTemplate.name} />
      )
    default:
      return (
        <Text>{paramTemplate.name}</Text>
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

function TextAreaField(props: { param: Params,  defaultValue: string, event: (val : string) => void }) {
  return (
    <XStack gap="$2">
      <Label size="$4">{props.param.name}</Label>
      <TextArea placeholder={props.param.example} defaultValue={props.defaultValue} onChangeText={(val) => {
        props.event(val)
      }} />
      <DescriptionHelpButton description={props.param.description} title={props.param.name}/>
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

export default function ServicesScreen() {
  const { applet, setApplet } = useApplet();
  const { navigationData, setNavigationData } = useNavigationData();
  const reaction : Reaction = getReaction(navigationData.reactionId, applet.reactions)
  const paramsValue = useRef<{ name: string; value: string }[]>([])
  
  const { serviceReactionList } = useServiceList();
  const [params, setParams] = React.useState<Params[]>([]);
  
  useEffect(() => {
    const filteredServices = serviceReactionList.filter((service) => service.service === reaction.service);
    const params = filteredServices[0].effect.filter((effect) => effect.name === reaction.name)[0].argumentsExample;
    setParams(params)

    for (let i = 0; i < params.length; i++) {
      paramsValue.current.push({
        name: params[i].name,
        value: ""
      })
    }
  }, [serviceReactionList, reaction])

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
  }

  return (
    <ScrollView>
      <YStack paddingVertical="$4" width="100%" alignItems='center' gap="$2" >
        <Link href={"/Create/services"} onPress={() => {setNavigationData({
          currentService: navigationData.currentService,
          actionType: "reaction",
          reactionId: navigationData.reactionId
        })}}>
          <H2>
            {reaction.service}
          </H2>
        </Link>
        <Link href={"/Create/reaction/effect"} onPress={() => {setNavigationData({
          currentService: navigationData.currentService,
          actionType: "modify",
          reactionId: navigationData.reactionId
        })}}>
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
