import { Button, YStack, XStack, Text, ScrollView, Card, H1, Paragraph} from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Info, CheckCircle, Play, Bolt } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useMedia } from 'tamagui'
import axios from 'axios';
import { getServerAddress } from './confirmServerAddress';

export default function GeneralHelp({title}: any) {
  const [services, setServices] = useState<any[]>([]);
  const [actions, setactions] = useState<any[]>([]);
  const [reactions, setreactions] = useState<any[]>([]);
  const router = useRouter();
  const media = useMedia();

  const apiUrl = useRef<string>("");

  const fetchServices = async () => {
    const token = await AsyncStorage.getItem('access_token');
    const apiUrl = await getServerAddress();
    if (apiUrl === "") {
        return;
    }
    try {
        const response = await axios.get(apiUrl + `/services`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("response", response);
        if (response.status === 200) {
            setServices(response.data);
        }
    } catch (error) {
        console.error(error);
    }
  }

  const fetchActions = async () => {
    const token = await AsyncStorage.getItem('access_token');
    const apiUrl = await getServerAddress();
    if (apiUrl === "") {
      return;
    }
    try {
        const response = await axios.get(apiUrl + `/actions/` + title, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("response", response);
        if (response.status === 200) {
            setactions(response.data);
        } else if (response.status === 404) {
          console.log("Aucune Actions !");
        }
    } catch (error) {
        console.error(error);
    }
}

const fetchReactions = async () => {
  const token = await AsyncStorage.getItem('access_token');
  const apiUrl = await getServerAddress();
  if (apiUrl === "") {
      return;
  } 
  try {
      const response = await axios.get(apiUrl + `/reactions/` + title, {
          headers: { Authorization: `Bearer ${token}` },
      });
      console.log("response", response);
      if (response.status === 200) {
          setreactions(response.data);
      } else if (response.status === 404) {
        console.log("Aucune Réactions !");
      }
  } catch (error) {
      console.error(error);
  }
}

  useEffect(() => {
    fetchServices();
    fetchActions();
    fetchReactions();
  } , [apiUrl.current]);

  useEffect(() => {
      getServerAddress().then((url) => {
          apiUrl.current = url;
      });
  }, []);

  const service = services.find((s) => s.service.toLowerCase() === title.toLowerCase());
  console.log(services);

  return (
    <YStack f={1} bg="$background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <YStack px="$4" gap="$4" alignItems="center">
          <YStack gap="$2">
            <H1>Getting Started with {title}</H1>
          </YStack>

          <Card
            elevate
            bordered
            width={media.sm ? '90%' : '50%'}
            animation="bouncy"
            scale={0.9}
            pressStyle={{ scale: 0.95 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                <Info size={24} color="$blue10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      About {service?.service}
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  <Paragraph size={media.sm ? "$2" : "$3"}>
                  {service?.description}
                  </Paragraph>
                </YStack>
              </Card.Footer>
            </YStack>
          </Card>

          <Card
            elevate
            bordered
            width={media.sm ? '90%' : '50%'}
            animation="bouncy"
            scale={0.9}
            pressStyle={{ scale: 0.95 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                <Play size={24} color="$blue10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      Available Actions
                    </Text>
                    <Text fontSize={media.sm ? "$2" : "$3"}>
                      Actions are events on {service?.service} that can trigger a reaction in AREA.
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  {actions.map((action, index) => (
                      <YStack key={index} width="100%">
                      {index !== 0 && (
                        <YStack
                          borderTopWidth={1}
                          borderTopColor="$gray5"
                          width="100%"
                          marginVertical="$2"
                        />
                      )}
                      <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                        {action?.name}
                      </Text>
                      <Text fontSize={media.sm ? "$2" : "$3"}>
                        {action?.description}
                      </Text>
                    </YStack>
                    ))}
                </YStack>
              </Card.Footer>
            </YStack>
          </Card>

          <Card
            elevate
            bordered
            width={media.sm ? '90%' : '50%'}
            animation="bouncy"
            scale={0.9}
            pressStyle={{ scale: 0.95 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                <Bolt size={24} color="$yellow10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      Available Reactions
                    </Text>
                    <Text fontSize={media.sm ? "$2" : "$3"}>
                      Reactions are actions that AREA can perform on {service?.name} in response to a trigger.
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  {reactions.map((reaction, index) => (
                      <YStack key={index} width="100%">
                      {index !== 0 && (
                        <YStack
                          borderTopWidth={1}
                          borderTopColor="$gray5"
                          width="100%"
                          marginVertical="$2"
                        />
                      )}
                      <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                        {reaction?.name}
                      </Text>
                      <Text fontSize={media.sm ? "$2" : "$3"}>
                        {reaction?.description}
                      </Text>
                    </YStack>
                    ))}
                </YStack>
              </Card.Footer>
            </YStack>
          </Card>

          <Card
            elevate
            bordered
            width={media.sm ? '90%' : '50%'}
            animation="bouncy"
            scale={0.9}
            pressStyle={{ scale: 0.95 }}
          >
            <YStack>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                <CheckCircle size={24} color="$green10" />
                  <YStack flex={1}>
                    <Text fontSize={media.sm ? "$5" : "$6"} fontWeight="bold">
                      You're All Set!
                    </Text>
                  </YStack>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack gap="$3" width="100%" alignItems="flex-start">
                  <Paragraph size={media.sm ? "$2" : "$3"}>
                    Now that you're familiar with the {service?.name} integration, you can start  creating powerful automations. 
                  </Paragraph>
                  <Button onPress={() => router.push('/create')}>
                    Create Applet
                  </Button>
                </YStack>
              </Card.Footer>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
