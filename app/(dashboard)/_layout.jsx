import React from 'react';
import { StatusBar } from "expo-status-bar";
import { router, Tabs } from "expo-router";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const TabIcon = ({ iconName, focused, name }) => (
  <View style={{
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  }}>
    <Ionicons 
      name={iconName} 
      size={24} 
      color={focused ? "#00E394" : "#666"} 
    />
    <Text style={{ 
      color: focused ? "#00E394" : "#666",
      fontSize: 12,
      marginTop: 4 
    }}>
      {name}
    </Text>
  </View>
);

const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: 'none' }
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
          }}
        />
      </Tabs>

      {/* Custom Tab Bar */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 30,
          height: '100%',
        }}>
          {/* Home Tab */}
          <TouchableOpacity
            onPress={() => router.push('/app')}
            style={{
              justifyContent: 'center',
            }}
          >
            <TabIcon
              iconName="home"
              focused={router.pathname === '/app'}
              name="Home"
            />
          </TouchableOpacity>

          {/* Settings Tab */}
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={{
              justifyContent: 'center',
            }}
          >
            <TabIcon
              iconName="settings"
              focused={router.pathname === '/profile'}
              name="Settings"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <StatusBar style="dark" />
    </>
  );
};

export default TabLayout;