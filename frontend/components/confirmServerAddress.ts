import { Alert, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =  process.env.EXPO_PUBLIC_API_URL || "localhost:8080";

export async function confirmServerAddress (newAddress : string) {
    try {
        const currentAdress = await AsyncStorage.getItem('serverAddress');
        if (currentAdress === newAddress) {
            return true;
        }
        await axios.get(`${newAddress}/about.json`);
        AsyncStorage.setItem('serverAddress', newAddress);
        const successString = 'Server address succesfully changed';
        Platform.OS === "web" ? alert(successString) : Alert.alert(successString);
        return true;
    } catch (error) {
        const errorString = 'The provided server address is invalid or the server is unreachable';
        Platform.OS === "web" ? alert(errorString) : Alert.alert(errorString);
    }
    return false;
}

export async function getServerAddress() {
    const serverAddress = await AsyncStorage.getItem('serverAddress');

    if (serverAddress && await confirmServerAddress(serverAddress)) {
        return serverAddress;
    }
    return API_URL;
}