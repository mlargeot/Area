import { Button, ScrollView, TextArea, Label, Switch, YStack, Text, View, XStack, Square, H2, SizeTokens, Input } from 'tamagui'
import { useApplet, Applet, getParamValueString } from '../../../../context/appletContext';
import { useServiceList, Params } from '../../../../context/serviceListContext';
import { Link } from 'expo-router'
import React, { useEffect, useRef } from 'react';
import DescriptionHelpButton from '../../../../components/descriptionHelpButton';

const returnField = (
  applet: Applet,
  paramTemplate : Params,
  paramsValue: React.MutableRefObject<{name: string; value: string;}[]>
) =>{
  const defaultValue : string = getParamValueString(paramTemplate.name, applet.action)

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

  switch (paramTemplate.type) {
    case "bool":
      return (
        <SwitchWithLabel size="$4" label={paramTemplate.name} defaultChecked />
      )
    case "string":
      handleInput(defaultValue)
      return (
        <InputField name={paramTemplate.name} defaultValue={defaultValue} event={handleInput} />
      )
      case "text":
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
  const paramsValue = useRef<{ name: string; value: string }[]>([])
  const { serviceActionList } = useServiceList();
  const [params, setParams] = React.useState<Params[]>([]);

  useEffect(() => {
    const filteredServices = serviceActionList.filter((service) => service.service.toLowerCase() === applet.action.service.toLowerCase());
    const params = filteredServices[0].effect.filter((effect) => effect.name === applet.action.name)[0].argumentsExample;
    setParams(params)

    for (let i = 0; i < params.length; i++) {
      paramsValue.current.push({
        name: params[i].name,
        value: ""
      })
    }
  }, [serviceActionList, applet.action.service, applet.action.name])

  const saveParams = () => {
    setApplet({
      ...applet,
      action: {
        ...applet.action,
        params: paramsValue.current.map((param) => {
          return {
            [param.name]: param.value
          }
        })
      }
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
            {returnField(applet, param, paramsValue)}
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
