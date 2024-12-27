import React from 'react';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import GettingStarted from './../../../components/GettingStarted';
import GeneralHelp from './../../../components/generalHelp';
import Header from './../../../components/header';

const services = [
    { name: 'Discord', color: '#5865F2', isActive: true, description1:"This is the documentation of reaction and actions discord.", description2:"GitHub is a web-based hosting service for version control using Git. It  is mostly used for computer code. It offers all of the distributed  version control and source code management (SCM) functionality of Git as well as adding its own features."},
    { name: 'Spotify', color: '#1DB954', isActive: false, description:""},
    { name: 'Twitch', color: '#9146FF', isActive: true, description:""},
    { name: 'X', color: '#1DA1F2', isActive: false, description:""},
    { name: 'Google', color: '#FF0000', isActive: true, description:""},
    { name: 'Github', color: '#333333', isActive: false, description:"This is the documentation of reaction and actions Github."},
];

const Actions = [
    { name: 'New push', description1:"Triggered when a new commit is pushed to a specified repository."},
];

const Reaction = [
    { name: 'Discord', color: '#5865F2', isActive: true, description1:"This is the documentation of reaction and actions discord.", description2:"GitHub is a web-based hosting service for version control using Git. It  is mostly used for computer code. It offers all of the distributed  version control and source code management (SCM) functionality of Git as well as adding its own features."},
];

export default function helppage() {
    const {serviceName} = useLocalSearchParams();
    const isLoggedIn = serviceName === 'Getting Started';

  return (
    <YStack f={1} bg="$background">
        <Header title={`${serviceName || 'Getting Started'}`} onPress={'/helpcenter'}/>
        {isLoggedIn ? <GettingStarted/> : <GeneralHelp />}

    </YStack>
  );
}