import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import Reanimated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring,
  interpolate,
  Easing as ReanimatedEasing
} from 'react-native-reanimated'

const ReanimatedView = Reanimated.View;

const AppHeader = ({ formattedDate, handleBack, activeSection, }) => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const iconRotation = useSharedValue(0);
  const [greeting, setGreeting] = useState('Hello');
  const [greetingIcon, setGreetingIcon] = useState('sunny-outline');
  
  const isDark = theme === 'dark';

  useEffect(() => {
    // Initial animation
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600, easing: ReanimatedEasing.bezier(0.25, 0.1, 0.25, 1) });
    
    // Theme toggle animation
    iconRotation.value = withSpring(isDark ? 1 : 0, { damping: 12 });
    
    // Set time-based greeting
    updateGreeting();
    
    // Update greeting every minute
    const intervalId = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(intervalId);
  }, [theme]);

  const updateGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Good morning');
      setGreetingIcon('sunny-outline');
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting('Good afternoon');
      setGreetingIcon('partly-sunny-outline');
    } else if (currentHour >= 17 && currentHour < 22) {
      setGreeting('Good evening');
      setGreetingIcon('moon-outline');
    } else {
      setGreeting('Good night');
      setGreetingIcon('cloudy-night-outline');
    }
  };

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(iconRotation.value, [0, 1], [0, 180])}deg` }
      ],
    };
  });

  const getGreetingColor = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return isDark ? 'text-yellow-400' : 'text-yellow-500'; // Morning - Yellow
    } else if (currentHour >= 12 && currentHour < 17) {
      return isDark ? 'text-blue-400' : 'text-blue-500'; // Afternoon - Blue
    } else if (currentHour >= 17 && currentHour < 22) {
      return isDark ? 'text-orange-400' : 'text-orange-500'; // Evening - Orange
    } else {
      return isDark ? 'text-indigo-400' : 'text-indigo-500'; // Night - Purple
    }
  };

  return (
    <>
      <View className="mx-2 p-3 rounded-lg bg-gray-900 h-[100px]  flex-row justify-between items-center mt-2">
        <View className="max-w-[60%]">
          {activeSection === 'dashboard' ? (
            <View>
              <View className="flex-row items-center mb-1">
                <Ionicons
                  name={greetingIcon}
                  size={18}
                  color="#f3f4f6"
                  style={{ marginRight: 6 }}
                />
                <Text className={`${getGreetingColor()} font-bold text-xl`}>
                  {greeting}
                </Text>
              </View>
             
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                  name="calendar-outline" 
                  size={16} 
                  color={isDark ? "#a78bfa" : "#6366f1"} 
                  style={{ marginRight: 4 }} 
                />
                <Text className="text-indigo-400 text-sm">
                  {formattedDate}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={handleBack} 
              className="flex-row items-center bg-gray-800 py-2 px-3 rounded-xl"
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color="#60a5fa" 
              />
              <Text className="text-blue-400 font-medium text-base ml-1">
                Back
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={toggleTheme} 
            className="mr-3"
            activeOpacity={0.7}
          >
            <View className="bg-gray-800 w-11 h-11 rounded-xl items-center justify-center shadow-sm">
              <ReanimatedView style={iconStyle}>
                {isDark ? (
                  <Ionicons name="sunny" size={22} color="#fcd34d" />
                ) : (
                  <Ionicons name="moon" size={22} color="#6366f1" />
                )}
              </ReanimatedView>
            </View>
          </TouchableOpacity>
        </View> */}
      </View>
    </>
  );
};

export default AppHeader;