import { Link, Tabs } from 'expo-router'
import { Button, useTheme, H2 } from 'tamagui'
import { Library, Compass, BadgePlus, User } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
          headerTitleStyle: {
              fontWeight: 'bold',
          },
          headerRight: () => (
              <Link href="/modal" asChild>
                  <Button mr="$4" bg="$purple8" color="$purple12">
                      Settings
                  </Button>
              </Link>
          ),
          headerLeft : () => (
            <H2 ml="$4">M3RA</H2>
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Compass color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Button mr="$4" bg="$purple8" color="$purple12">
                Hello!
              </Button>
            </Link>
          ),
        }}
      />
    <Tabs.Screen
        name="library"
        options={{
            title: 'Library',
            tabBarIcon: ({ color }) => <Library color={color} />,
        }}
    />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <BadgePlus color={color} />,
        }}
      />
        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                tabBarIcon: ({ color }) => <User color={color} />,
            }}
        />
    </Tabs>

  )
}
