import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {Platform} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const LoginService  = async (slug : string) : Promise<any> => {
    const router = useRouter();
    const redirectUri = Linking.createURL('/auth/callback');
    console.log("LoginService called with slug: " + slug);
    console.log("LoginService redirectUri: " + redirectUri);
    const serverUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
    //redirect directly to backend auth endpoint

    if (Platform.OS === 'web') {
        window.location.href = serverUrl + "/auth/login/" + slug + "?redirect_uri=" + redirectUri;
    } else {
        const androidRedirectUri = Linking.createURL('/auth/callback');
        const result: any = await WebBrowser.openAuthSessionAsync(
        serverUrl + "/auth/login/" + slug + "?redirect_uri=" + androidRedirectUri,
        );
        if (result.type === 'success' && result.url) {
            console.log("Auth session success:", result.url);
            const urlParams = new URLSearchParams(result.url.split('?')[1]);
            const token = urlParams.get('token');
            if (token) {
                console.log("Token received:", token);
                await AsyncStorage.setItem('access_token', token);
                router.push('/explore');
            } else {
                console.error("Token not found in redirect URL.");
            }
          }

    }
}

export default LoginService;