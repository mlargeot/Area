import { YStack } from 'tamagui';
import SignUp from '../components/signup';

export default function signupScreen() {

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="#f2f2f2"
      padding="$4"
    >
      <SignUp/>
    </YStack>
  );
}
