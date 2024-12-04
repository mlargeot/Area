import { YStack } from 'tamagui';
import Login from '../components/login';
import {useColorScheme} from "react-native";

export default function loginScreen() {
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
            <Login/>
        </YStack>
    );
}