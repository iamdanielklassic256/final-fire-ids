import { 
  View, 
  Text, 
  Image, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';

// Import assets
import logo from '../assets/logo/logo.png';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Safe area insets
  const insets = useSafeAreaInsets();

  // Handle navigation to dashboard
  const handleRoute = () => {
    // Provide haptic feedback on button press
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Navigate to dashboard
    router.push('/dashboard');
  };

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#cb4523" />
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={{ 
              flex: 1, 
              justifyContent: 'space-between', 
              paddingTop: insets.top || 40,
              paddingBottom: insets.bottom || 20,
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }}
          >
            {/* Logo with subtle shadow */}
            <View className="items-center mb-4">
              <Image
                source={logo}
                className="w-[180px] h-[180px] rounded-full shadow-md"
                resizeMode="contain"
              />
              <Text className="text-[#cb4523] font-bold text-lg mt-2">Fire Sentinel</Text>
            </View>

            {/* Hero Text */}
            <View className="mb-8">
              <Text className="text-gray-900 text-center text-3xl font-extrabold leading-tight mb-4">
                Smart Fire{"\n"}Detection System
              </Text>
              <Text className="text-gray-700 text-center text-base leading-6 px-4">
                Monitor fire hazards in real-time, receive instant alerts, and protect your property with our advanced IoT fire detection system.
              </Text>
            </View>

            {/* Features Overview */}
            <View className="mb-8">
              <View className="flex-row items-center mb-3">
                <MaterialIcons name="sensors" size={24} color="#cb4523" />
                <Text className="text-gray-800 text-base ml-3">Real-time temperature and smoke monitoring</Text>
              </View>
              <View className="flex-row items-center mb-3">
                <MaterialIcons name="notifications-active" size={24} color="#cb4523" />
                <Text className="text-gray-800 text-base ml-3">Instant alerts and emergency notifications</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="query-stats" size={24} color="#cb4523" />
                <Text className="text-gray-800 text-base ml-3">Data analytics and fire risk assessment</Text>
              </View>
            </View>

            {/* CTA Buttons */}
            <View className="space-y-4">
              <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                <TouchableOpacity
                  onPress={handleRoute}
                  className="bg-[#cb4523] py-4 rounded-xl shadow-lg"
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-center text-lg font-bold">Get Started</Text>
                </TouchableOpacity>
              </Animated.View>
              
              <TouchableOpacity
                onPress={() => router.push('/sign-in')}
                className="border border-[#cb4523] py-4 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-[#cb4523] text-center text-lg font-bold">I Already Have an Account</Text>
              </TouchableOpacity>
            </View>
            
            {/* Version info */}
            <Text className="text-gray-400 text-center text-xs mt-6">
              Version 1.0.0
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default WelcomeScreen;