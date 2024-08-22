import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { Redirect, router, Tabs } from "expo-router";
import { View, TouchableOpacity, Dimensions, Animated, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { Loader } from "../../components";

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width;
const TAB_WIDTH = TAB_BAR_WIDTH / 4;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const TabIcon = ({ iconName, color, focused, name, notifications = 0 }) => (
  <Animated.View style={{
    alignItems: 'center',
    justifyContent: 'center',
    width: TAB_WIDTH,
    height: focused ? 80 : 60,
    transform: [{
      translateY: focused ? -40 : 0
    }],
  }}>
    <LinearGradient
      colors={focused ? ['#00E394', '#028758'] : ['#161622', '#161622']}
      style={{
        borderRadius: focused ? 25 : 0,
        padding: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={iconName} size={focused ? 30 : 24} color="#fff" />
      <Text style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>{name}</Text>
      {notifications > 0 && (
        <View style={{
          position: 'absolute',
          top: 5,
          right: 5,
          backgroundColor: 'red',
          borderRadius: 10,
          width: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: 'white', fontSize: 10 }}>{notifications}</Text>
        </View>
      )}
    </LinearGradient>
  </Animated.View>
);

const TabLayout = () => {
  const { loading, setLoading } = useState();
  const [activeTab, setActiveTab] = React.useState(0);
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;


  const animateTabTransition = (index) => {
    Animated.spring(tabIndicatorPosition, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#00E394",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
        tabBar={(props) => (
          <View style={{
            flexDirection: 'row',
            height: 60,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
            <LinearGradient
              colors={['#161622', '#1E1E2A']}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <AnimatedSvg
              width={TAB_WIDTH}
              height={60}
              style={{
                position: 'absolute',
                transform: [{ translateX: tabIndicatorPosition }],
              }}
            >
              <Path
                d={`M0 60 C20 60 20 30 40 30 C60 30 60 60 80 60`}
                fill="#00E394"
                fillOpacity={0.2}
              />
            </AnimatedSvg>
            {props.state.routes.map((route, index) => {
              const { options } = props.descriptors[route.key];
              const isFocused = props.state.index === index;

              const onPress = () => {
                const event = props.navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  props.navigation.navigate(route.name);
                }
                setActiveTab(index);
                animateTabTransition(index);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              };

              let iconName;
              let name;
              let notifications = 0;
              if (route.name === 'app') {
                iconName = 'home';
                name = 'Home';
              } else if (route.name === 'saving-group') {
                iconName = 'people';
                name = 'Savings';
                notifications = 2; // Example: 2 new savings opportunities
              } else if (route.name === 'loan') {
                iconName = 'cash';
                name = 'Loan';
              } else if (route.name === 'profile') {
                iconName = 'settings';
                name = 'Settings';
                notifications = 1; // Example: 1 new setting to review
              }

              return (
                <TouchableOpacity
                  key={index}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <TabIcon
                    iconName={iconName}
                    color={isFocused ? "#00E394" : "#CDCDE0"}
                    focused={isFocused}
                    name={name}
                    notifications={notifications}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      >
        <Tabs.Screen
          name="app"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="saving-group"
          options={{
            headerTitle: "Saving Groups",
            headerShown: true,
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
            },
            headerRight: () => (
              <Ionicons
                name="add-circle-outline"
                size={24}
                color="#007AFF"
                style={{ marginRight: 15 }}
                onPress={() => {
                  // Add logic to create a new saving group
                  router.push('/add-group')
                  console.log("Create new saving group");
                }}
              />
            ),
            headerLeft: () => (
              <Ionicons
                name="arrow-back"
                size={24}
                color="#007AFF"
                style={{ marginLeft: 15 }}
                onPress={() => {
                  // Add navigation logic to go back
                  router.navigate('/app')
                  console.log("Go back");
                }}
              />
            ),
            headerStyle: {
              backgroundColor: '#F5F5F5',
            },
            headerTintColor: '#333',
            presentation: 'modal',
            animation: 'slide_from_bottom',
            contentStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
        <Tabs.Screen
          name="loan"
          options={{
            title: "Loan",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Settings",
            headerShown: false,

          }}
          
        />
      </Tabs>
      <Loader isLoading={loading} />
      <StatusBar backgroundColor="transparent" style="light" translucent />
    </>
  );
};

export default TabLayout;