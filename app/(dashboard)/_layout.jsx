import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StatusBar, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <>
      <StatusBar backgroundColor="#f27c22" barStyle="light-content" />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#f27c22',
          tabBarInactiveTintColor: '#A0AEC0', // muted gray for inactive
          tabBarStyle: {
            height: 70,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 5, // for Android shadow
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            headerShown: false,
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
