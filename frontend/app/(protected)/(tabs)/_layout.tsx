import { Tabs } from 'expo-router';
import { Logs, Search, PlusCircle, User } from '@tamagui/lucide-icons';
import { useTheme } from 'tamagui';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
      }}
    >
      <Tabs.Screen 
        name="explore" 
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Search color={color} />
        }} 
      />
      <Tabs.Screen 
        name="logs"
        options={{
          title: 'Logs',
          tabBarIcon: ({ color }) => <Logs color={color} />
        }} 
      />
      <Tabs.Screen 
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <Logs color={color} />
        }} 
      />
      <Tabs.Screen 
        name="create" 
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <PlusCircle color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} />
        }} 
      />
    </Tabs>
  );
}