import * as Linking from 'expo-linking';
import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';

const ConnectService  = async (slug : string) : Promise<any> => {
    const redirectUri = Linking.createURL('/services');
    console.log("ConnectService called with slug: " + slug);
    console.log("ConnectService redirectUri: " + redirectUri);
    const serverUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

    const token = await AsyncStorage.getItem('access_token');

    try {
        console.log("ConnectService token: " + token);
        const response = await axios.get(`${serverUrl}/auth/connect/${slug}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                redirect_uri: redirectUri
            }
        });
        console.log(response);
        if (Platform.OS === 'web') {
            window.location.href = response.data.redirect_uri;
        } else {
            const result : any = await WebBrowser.openAuthSessionAsync(
                response.data.redirect_uri,
            );
            console.log("ConnectService result: " + result);
        }
    } catch (error) {
        console.error(error);
    }

}

export default ConnectService;