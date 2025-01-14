import React, { XStack, YStack, Text, Card, H1, H2, H3, Paragraph, Progress, ScrollView, } from 'tamagui'
import { useState } from 'react'
import { SafeAreaView } from 'react-native';
import { Activity, Zap, Users, Layers, Star, Clock } from '@tamagui/lucide-icons'

const actionData = [
  { name: "Jan", count: 120 },
  { name: "Fév", count: 150 },
  { name: "Mar", count: 180 },
  { name: "Avr", count: 220 },
  { name: "Mai", count: 250 },
  { name: "Juin", count: 300 },
]

const appletData = [
  { name: "Jan", count: 50 },
  { name: "Fév", count: 60 },
  { name: "Mar", count: 75 },
  { name: "Avr", count: 90 },
  { name: "Mai", count: 110 },
  { name: "Juin", count: 130 },
]

export default function DashboardPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        <YStack flex={1} padding="$4" gap="$4" bg="$background">
          <H1>Tableau de bord d'exploration</H1>
          <XStack flexWrap="wrap" justifyContent="space-between" gap="$4">
            {[
              { title: "Total des actions", value: "1,220", change: "+20.1% par rapport au mois dernier", icon: Activity },
              { title: "Applets actifs", value: "515", change: "+15.5% par rapport au mois dernier", icon: Zap },
              { title: "Utilisateurs actifs", value: "3,782", change: "+8.2% par rapport au mois dernier", icon: Users },
              { title: "Catégories d'actions", value: "24", change: "+2 nouvelles catégories ce mois-ci", icon: Layers },
            ].map((stat, index) => (
              <Card key={index} elevate size="$4" bordered padding="$4" flex={1} minWidth={200}>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" fontWeight="bold">{stat.title}</Text>
                  <stat.icon size={16} />
                </XStack>
                <H2 marginTop="$2">{stat.value}</H2>
                <Paragraph size="$2">{stat.change}</Paragraph>
              </Card>
            ))}
          </XStack>

          <XStack flexWrap="wrap" justifyContent="space-between" gap="$4">
            {[
              { data: actionData, title: "Croissance des actions" },
              { data: appletData, title: "Croissance des applets" },
            ].map((chart, index) => (
              <Card key={index} elevate size="$4" bordered padding="$4" flex={1} minWidth={300}>
                <H3>{chart.title}</H3>
                <YStack gap="$2" marginTop="$4">
                  {chart.data.map((item, itemIndex) => (
                    <XStack key={itemIndex} justifyContent="space-between" alignItems="center">
                      <Text>{item.name}</Text>
                      <Progress 
                        value={item.count} 
                        max={Math.max(...chart.data.map(d => d.count))} 
                        width={200} 
                      />
                      <Text>{item.count}</Text>
                    </XStack>
                  ))}
                </YStack>
              </Card>
            ))}
          </XStack>

          <XStack flexWrap="wrap" justifyContent="space-between" gap="$4">
            {[
              { title: "Actions les plus populaires", value: "Envoi d'email", change: "Utilisée dans 45% des applets", icon: Star },
              { title: "Temps moyen d'exécution", value: "1.2 secondes", change: "-0.3s par rapport au mois dernier", icon: Clock },
              { title: "Taux de réussite des actions", value: "99.8%", change: "+0.2% par rapport au mois dernier", icon: Activity },
              { title: "Nouvelles intégrations", value: "5", change: "Ajoutées ce mois-ci", icon: Layers },
            ].map((stat, index) => (
              <Card key={index} elevate size="$4" bordered padding="$4" flex={1} minWidth={200}>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" fontWeight="bold">{stat.title}</Text>
                  <stat.icon size={16} />
                </XStack>
                <H2 marginTop="$2">{stat.value}</H2>
                <Paragraph size="$2">{stat.change}</Paragraph>
              </Card>
            ))}
          </XStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  )
}