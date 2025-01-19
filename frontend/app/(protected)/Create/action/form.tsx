import React, { useEffect, useRef, useState } from 'react'
import { 
  ScrollView, YStack, XStack, Card, H1, Text, Button, Input, 
  TextArea, Switch, Label, Select, Paragraph, Theme 
} from 'tamagui'
import { ChevronLeft, Save, HelpCircle } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { useApplet, Applet, getParamValueString } from '../../../../context/appletContext'
import { useServiceList, Params } from '../../../../context/serviceListContext'

const ParamField = ({ param, value, onChange, applet } : {param : Params, value : any, onChange : (value : any) => void, applet : Applet}) => {
  const defaultValue = getParamValueString(param.name, applet.action)

  switch (param.type) {
    case "bool":
      return (
        <XStack alignItems="center" space>
          <Switch 
            id={`switch-${param.name}`}
            size="$4"
            checked={value === "true"}
            onCheckedChange={(checked) => onChange(checked)}
          >
            <Switch.Thumb animation="quick" />
          </Switch>
          <Label htmlFor={`switch-${param.name}`} size="$4">{param.name}</Label>
        </XStack>
      )
    case "string":
      return (
        <Input
          placeholder={param.example || "Enter text"}
          value={value || defaultValue}
          onChangeText={onChange}
        />
      )
    case "text":
      return (
        <TextArea
          placeholder={param.example || "Enter text"}
          value={value || defaultValue}
          onChangeText={onChange}
        />
      )
    case "date":
      return (
        <Input
          placeholder="YYYY-MM-DD"
          value={value || defaultValue}
          onChangeText={onChange}
        />
      )
    case "number":
      return (
        <Input
          placeholder={param.example || "Enter number"}
          value={value || defaultValue}
          onChangeText={onChange}
          keyboardType="numeric"
        />
      )
    default:
      return <Text>Unsupported param type: {param.type}</Text>
  }
}

export default function ServicesScreen() {
  const { applet, setApplet } = useApplet()
  const { serviceActionList } = useServiceList()
  const [params, setParams] = useState<Params[]>([])
  const [paramValues, setParamValues] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const filteredServices = serviceActionList.filter(
      (service) => service.service.toLowerCase() === applet.action.service.toLowerCase()
    )
    const actionParams = filteredServices[0]?.effect.find(
      (effect) => effect.name === applet.action.name
    )?.argumentsExample || []
    setParams(actionParams)

    const initialValues: { [key: string]: string } = {}
    actionParams.forEach(param => {
      initialValues[param.name] = getParamValueString(param.name, applet.action) || ''
    })
    setParamValues(initialValues)
  }, [serviceActionList, applet.action.service, applet.action.name])

  const saveParams = () => {
    setApplet({
      ...applet,
      action: {
        ...applet.action,
        params: Object.entries(paramValues).map(([name, value]) => ({ [name]: value }))
      }
    })
  }

  return (
    <Theme>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '$background' }}>
        <YStack padding="$4" space="$4">
          <Card borderRadius="$4" padding="$4" elevate>
            <XStack justifyContent="space-between" alignItems="center">
              <Link href="/Create/services" asChild>
                <Button icon={ChevronLeft} circular size="$3" backgroundColor="$blue8" />
              </Link>
              <H1 color="$blue10" fontWeight="bold">{applet.action.service}</H1>
              <Button icon={Save} circular size="$3" backgroundColor="$blue8" onPress={saveParams} />
            </XStack>
          </Card>

          <Card borderRadius="$4" padding="$4" elevate>
            <YStack space="$4">
              <Text fontSize="$6" fontWeight="bold" textAlign="center">
                {applet.action.name}
              </Text>
              <Paragraph textAlign="center">
                Configure the parameters for this action
              </Paragraph>

              {params.map((param, index) => (
                <YStack key={index} space="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Label htmlFor={param.name}>
                      {param.name}
                    </Label>
                    <Button 
                      icon={HelpCircle} 
                      circular 
                      size="$2"
                      backgroundColor="transparent"
                      onPress={() => alert(param.description)}
                    />
                  </XStack>
                  <ParamField
                    param={param}
                    value={paramValues[param.name] || ''}
                    onChange={(value : any) => setParamValues(prev => ({ ...prev, [param.name]: value }))}
                    applet={applet}
                  />
                </YStack>
              ))}
            </YStack>
          </Card>

          <Link href="/create" asChild>
            <Button 
              backgroundColor="$blue10"
              size="$5"
              onPress={saveParams}
            >
              Save Changes
            </Button>
          </Link>
        </YStack>
      </ScrollView>
    </Theme>
  )
}

