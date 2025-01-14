import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Text, View, YStack } from 'tamagui'
import { Applet, LogMessage, simulateAppletExecution } from './applet.ts'
import { useMedia } from 'tamagui'


const APPLETS: Applet[] = [
    { id: '1', type: 'action', name: 'Nouveau email reçu' },
    { id: '2', type: 'reaction', name: 'Envoyer une notification' },
    { id: '3', type: 'action', name: 'Température dépasse 25°C' },
    { id: '4', type: 'reaction', name: 'Allumer la climatisation' },
]

export default function AppletLog() {
    const [logs, setLogs] = useState<LogMessage[]>([])
    const media = useMedia();
  
    const addLog = (applet: Applet, success: boolean) => {
      const newLog: LogMessage = {
        applet,
        timestamp: new Date().toLocaleTimeString(),
        success
      }
      setLogs(prevLogs => [...prevLogs, newLog])
    }
  
    const runApplet = (applet: Applet) => {
      const success = simulateAppletExecution(applet)
      if (!success) {
        addLog(applet, false)
      }
    }
  
    useEffect(() => {
      const interval = setInterval(() => {
        const randomApplet = APPLETS[Math.floor(Math.random() * APPLETS.length)]
        runApplet(randomApplet)
      }, 3000)
  
      return () => clearInterval(interval)
    }, [])
  
    const renderLogItem = ({ item }: { item: LogMessage }) => (
      <Text
        color={item.success ? '$red10' : '$gray11'}
        fontSize={14}
        marginBottom={8}
      >
        <Text color="$gray10" fontSize={12}>[{item.timestamp}] </Text>
        <Text fontWeight="bold">{item.applet.name} ({item.applet.type})</Text>:{' '}
        {item.success ? 'a réussi' : 'a échoué'}
      </Text>
    )
  
    return (
      <YStack padding={16} f={1} alignItems="center">
        <Text fontSize={24} fontWeight="bold" marginBottom={16}>Logs d'Applets</Text>
        <View
            style={{
            flex: 1,
            Height: media.sm ? "90%" : "50%",
            width: media.sm ? "90%" : "50%",
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            padding: 16,
            }}
        >
            <FlatList
            data={logs}
            renderItem={renderLogItem}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled
            />
        </View>
      </YStack>
    );
  }
  
