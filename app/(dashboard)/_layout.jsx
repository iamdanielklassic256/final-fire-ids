import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#E63946', // vibrant red for active items
          tabBarInactiveTintColor: '#6B7280', // medium gray for inactive
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 80 : 70,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
            paddingTop: 10,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 8, // enhanced for Android shadow
            position: 'absolute', // makes tab bar float
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          headerShown: false,
          tabBarIconStyle: {
            marginBottom: -4, // tighten the spacing between icon and label
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: 'Alerts',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="fire" color={color} />
            ),
            tabBarBadge: 3, // Example of notification badge
            tabBarBadgeStyle: { backgroundColor: '#E63946' }
          }}
        />
        <Tabs.Screen
          name="sensors"
          options={{
            title: 'Sensors',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="signal" color={color} />
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