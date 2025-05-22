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
  Animated,
  ImageBackground
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import assets
import logo from '../assets/logo/logo.png';
// Add these forest images to your assets folder
import forestBackground from '../assets/forest-background.jpg';
import forestReservation from '../assets/forest-reservation.jpg';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;
  const forestImageAnim = useRef(new Animated.Value(0)).current;
  
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
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(forestImageAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#cb4523" />
      <ImageBackground 
        source={forestBackground} 
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(45, 80, 22, 0.8)', 'rgba(203, 69, 35, 0.1)', 'rgba(255, 255, 255, 0.95)']}
          style={{ flex: 1 }}
        >
          <SafeAreaView className="flex-1">
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
                {/* Header Section with Logo */}
                <View className="items-center mb-6">
                  <Image
                    source={logo}
                    className="w-[160px] h-[160px] rounded-full shadow-lg"
                    resizeMode="contain"
                  />
                  <Text className="text-[#cb4523] font-bold text-2xl mt-3">Fire Sentinel</Text>
                  <Text className="text-[#cb4523] font-medium text-sm opacity-80">Forest Protection System</Text>
                </View>

                {/* Features Overview */}
                <View className="mb-8 bg-white/90 rounded-xl p-4 shadow-sm">
                  <Text className="text-[#cb4523] font-bold text-lg mb-4 text-center">System Features</Text>
                  
                  <View className="flex-row items-center mb-3">
                    <View className="bg-[#cb4523] rounded-full p-2 mr-3">
                      <MaterialIcons name="park" size={20} color="white" />
                    </View>
                    <Text className="text-gray-800 text-base flex-1">Forest reserve monitoring & management</Text>
                  </View>
                  
                  <View className="flex-row items-center mb-3">
                    <View className="bg-[#cb4523] rounded-full p-2 mr-3">
                      <MaterialIcons name="sensors" size={20} color="white" />
                    </View>
                    <Text className="text-gray-800 text-base flex-1">Real-time flame and smoke detection</Text>
                  </View>
                  
                  <View className="flex-row items-center mb-3">
                    <View className="bg-[#cb4523] rounded-full p-2 mr-3">
                      <MaterialIcons name="notifications-active" size={20} color="white" />
                    </View>
                    <Text className="text-gray-800 text-base flex-1">Emergency alerts & notifications</Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="bg-[#cb4523] rounded-full p-2 mr-3">
                      <MaterialIcons name="analytics" size={20} color="white" />
                    </View>
                    <Text className="text-gray-800 text-base flex-1">Forest health analytics & reporting</Text>
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
                      <View className="flex-row items-center justify-center">
                        <Text className="text-white text-center text-lg font-bold ml-2">
                          Get Started
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                  
                  <TouchableOpacity
                    onPress={() => router.push('/dashboard')}
                    className="border-2 border-[#cb4523] bg-white/90 py-4 rounded-xl shadow-sm"
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-[#cb4523] text-center text-lg font-bold ml-2">
                       LOGIN
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Footer Info */}
                <View className="mt-6 items-center">
                  <View className="flex-row items-center">
                    <MaterialIcons name="security" size={16} color="#cb4523" />
                    <Text className="text-[#cb4523] text-sm ml-1 opacity-80">
                      Secure • Reliable • 24/7 Monitoring
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </>
  );
};

export default WelcomeScreen;