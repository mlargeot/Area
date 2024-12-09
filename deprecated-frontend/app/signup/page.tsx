import { YStack } from 'tamagui';
import SignUp from '../components/signup';
import {useColorScheme} from "react-native";

export default function signupScreen() {
    const theme = useColorScheme();

    const backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';

    return (
        <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            backgroundColor={backgroundColor}
            padding="$4"
        >
            <SignUp/>
        </YStack>
    );
}