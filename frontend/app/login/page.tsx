import { YStack } from 'tamagui';
import Login from '../components/login';

export default function loginScreen() {

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="#f2f2f2"
      padding="$4"
    >
      <Login/>
    </YStack>
  );
}
