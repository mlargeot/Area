import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const LoginService  = async (slug : string) : Promise<any> => {
    const redirectUri = Linking.createURL('/auth/callback');
    console.log("LoginService called with slug: " + slug);
    console.log("LoginService redirectUri: " + redirectUri);
    const serverUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

    //redirect directly to backend auth endpoint
    const result : any = await WebBrowser.openAuthSessionAsync(
            serverUrl + "/auth/login/" + slug + "?redirect_uri=" + redirectUri,
    );
    console.log("LoginService result: " + result);
}

export default LoginService;