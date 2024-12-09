import { YStack, Theme } from 'tamagui';
import Login from '../components/login';

export default function loginScreen() {

    return (
        <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$4"
        >
            <Login/>
        </YStack>
    );
}