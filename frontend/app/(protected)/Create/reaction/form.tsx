import React, { useEffect, useState } from 'react'
import { 
  ScrollView, YStack, XStack, Card, H1, Text, Button, Input, 
  TextArea, Switch, Label, Paragraph, Theme 
} from 'tamagui'
import { ChevronLeft, Save, HelpCircle } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { useNavigationData } from '../../../../context/navigationContext'
import { useApplet, Reaction, emptyReaction, getParamValueString } from '../../../../context/appletContext'
import { useServiceList, Params } from '../../../../context/serviceListContext'

const ParamField = ({ param, value, onChange, reaction }) => {
  const defaultValue = getParamValueString(param.name, reaction)

  switch (param.type) {
    case "bool":
      return (
        <XStack alignItems="center" space>
          <Switch 
            id={`switch-${param.name}`}
            size="$4"
            checked={value === "true"} 
            onCheckedChange={(checked) => onChange(checked.toString())}
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

const getReaction = (reactionId: string, reactions: Reaction[]): Reaction => {
  return reactions.find(r => r._id === reactionId) || emptyReaction()
}

export default function ServicesScreen() {
  const { applet, setApplet } = useApplet()
  const { navigationData, setNavigationData } = useNavigationData()
  const { serviceReactionList } = useServiceList()
  
  const reaction = getReaction(navigationData.reactionId, applet.reactions)
  const [params, setParams] = useState<Params[]>([])
  const [paramValues, setParamValues] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const filteredServices = serviceReactionList.filter(
      (service) => service.service.toLowerCase() === reaction.service.toLowerCase()
    )
    const reactionParams = filteredServices[0]?.effect.find(
      (effect) => effect.name === reaction.name
    )?.argumentsExample || []
    setParams(reactionParams)

    const initialValues = {}
    reactionParams.forEach(param => {
      initialValues[param.name] = getParamValueString(param.name, reaction) || ''
    })
    setParamValues(initialValues)
  }, [serviceReactionList, reaction])

  const saveParams = () => {
    setApplet({
      ...applet,
      reactions: applet.reactions.map((r) => {
        if (r._id === navigationData.reactionId) {
          return {
            ...r,
            params: Object.entries(paramValues).map(([name, value]) => ({ [name]: value }))
          }
        }
        return r
      })
    })
  }

  return (
    <Theme>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack padding="$4" space="$4">
          <Card borderRadius="$4" padding="$4" elevate>
            <XStack justifyContent="space-between" alignItems="center">
              <Link 
                href="/Create/services" 
                asChild
                onPress={() => {
                  setNavigationData({
                    currentService: navigationData.currentService,
                    actionType: "modify",
                    reactionId: navigationData.reactionId
                  })
                }}
              >
                <Button icon={ChevronLeft} circular size="$3" backgroundColor="$purple8" />
              </Link>
              <H1 color="$purple10" fontWeight="bold">{reaction.service}</H1>
              <Button icon={Save} circular size="$3" backgroundColor="$purple8" onPress={saveParams} />
            </XStack>
          </Card>

          <Card borderRadius="$4" padding="$4" elevate>
            <YStack space="$4">
              <Text fontSize="$6" fontWeight="bold" textAlign="center">
                {reaction.name}
              </Text>
              <Paragraph textAlign="center">
                Configure the parameters for this reaction
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
                    onChange={(value) => setParamValues(prev => ({ ...prev, [param.name]: value }))}
                    reaction={reaction}
                  />
                </YStack>
              ))}
            </YStack>
          </Card>

          <Link href="/create" asChild>
            <Button 
              backgroundColor="$purple10"
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

