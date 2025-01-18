import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {Platform} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginService  = async (slug : string) : Promise<any> => {
    const redirectUri = Linking.createURL('/explore');
    console.log("LoginService called with slug: " + slug);
    console.log("LoginService redirectUri: " + redirectUri);
    const serverUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

    if (Platform.OS === 'web') {
        window.location.href = serverUrl + "/auth/login/" + slug + "?redirect_uri=" + redirectUri;
    } else {
        const result: any = await WebBrowser.openAuthSessionAsync(
            serverUrl + "/auth/login/" + slug + "?redirect_uri=" + redirectUri,
            redirectUri
        );
    }
}

export default LoginService;