import React from 'react';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import GettingStarted from './../../../components/GettingStarted';
import GeneralHelp from './../../../components/generalHelp';
import Header from './../../../components/header';

export default function helppage() {
    const {serviceName} = useLocalSearchParams();
    const isLoggedIn = serviceName === 'Getting Started';

  return (
    <YStack f={1} bg="$background">
        <Header title={`${serviceName || 'd'}`} onPress={'/helpcenter'}/>
        {isLoggedIn ? <GettingStarted/> : <GeneralHelp title={`${serviceName}`}/>}

    </YStack>
  );
}