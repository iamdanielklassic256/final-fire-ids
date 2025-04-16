import { View, Text, TouchableOpacity, Image, Animated } from 'react-native'
import React, { useContext, useRef, useEffect } from 'react'
import logo from '../../assets/logo/logo.png'
import { ThemeContext } from '../../context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import Reanimated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring,
  interpolate,
  Easing as ReanimatedEasing
} from 'react-native-reanimated'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const ReanimatedView = Reanimated.View;

const AppHeader = ({ formattedDate, handleBack, activeSection }) => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const iconRotation = useSharedValue(0);
  
  // Define theme colors directly in component to avoid import issues
  const themeColors = {
    light: {
      background: '#FFFFFF',
      text: '#000000',
      primary: '#007AFF',
      secondary: '#5856D6',
      border: '#E5E5EA',
      card: '#F2F2F7',
    },
    dark: {
      background: '#121212',
      text: '#FFFFFF',
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      border: '#38383A',
      card: '#1C1C1E',
    }
  }
  
  const colors = themeColors[theme] || themeColors.light;

  useEffect(() => {
    // Initial animation
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });
    
    // Theme toggle animation
    iconRotation.value = theme === 'dark' ? withTiming(1, { duration: 300 }) : withTiming(0, { duration: 300 });
  }, [theme]);

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(iconRotation.value, [0, 1], [0, 180])}deg` }
      ],
    };
  });

  return (
    <ReanimatedView style={[
      { backgroundColor: colors.background },
      { padding: 16, paddingTop: 20, paddingBottom: 24 },
      headerStyle
    ]}>
      <View style={{ 
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  marginTop: 10 // Add some spacing from status bar
}}>
        <View>
          {activeSection === 'dashboard' ? (
            <View>
              <Text style={{ 
                color: colors.text, 
                fontFamily: 'Poppins-Bold',
                fontSize: 20,
                marginBottom: 4
              }}>
                Welcome back
              </Text>
              <Text style={{ 
                color: colors.secondary, 
                fontFamily: 'Poppins-Regular',
                opacity: 0.7
              }}>
                {formattedDate}
              </Text>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={handleBack} 
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Ionicons name="chevron-back" size={22} color={colors.primary} />
              <Text style={{ 
                color: colors.primary, 
                fontFamily: 'Poppins-Medium',
                fontSize: 16,
              }}>
                Back
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={{ marginRight: 16 }}
            activeOpacity={0.7}
          >
            <View style={{ 
              backgroundColor: colors.card,
              width: 48, 
              height: 48, 
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3
            }}>
              <ReanimatedView style={iconStyle}>
                {theme === 'dark' ? (
                  <Ionicons name="sunny" size={22} color={colors.text} />
                ) : (
                  <Ionicons name="moon" size={22} color={colors.text} />
                )}
              </ReanimatedView>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity activeOpacity={0.8}>
            <Image
              source={logo}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ReanimatedView>
  );
};

export default AppHeader;