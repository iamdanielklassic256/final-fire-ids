import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { Bell, AlertTriangle, Shield, Phone, User, User2 } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function Dashboard() {
  // Animation state
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  const handleNavigation = (route, index) => {
    setActiveCardIndex(index);

    // Add a small delay before navigation for the button press animation
    setTimeout(() => {
      router.push(route);
      setActiveCardIndex(null);
    }, 150);
  };


  // Card animation styles
  const getCardStyle = (index) => {
    return activeCardIndex === index ? { transform: [{ scale: 0.95 }] } : {};
  };

  const handleRoute = () => {
    router.push('/settings')
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-600">


      <View className="px-4">
        <Text className="text-4xl font-bold text-white">Fire Sentinel</Text>
        <Text className="text-white/80 mt-1">Stay informed • Stay safe</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          onPress={handleRoute}
          accessibilityLabel="User profile"
        >
          <User2 size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* Main Content */}
      <View className="flex-1 bg-gray-50 rounded-t-xl -mt-5">
        <ScrollView className="flex-1 p-3">
          {/* Main Feature Cards Grid */}
          <View className="flex-row flex-wrap justify-between">
            {/* Fire Alerts Card */}
            <Animated.View
              className="w-[48%] mb-4"
              entering={FadeInDown.delay(100).duration(500)}
            >
              <TouchableOpacity
                className="bg-red-50 p-5 rounded-xl shadow-md flex-col justify-between h-36"
                style={getCardStyle(0)}
                onPress={() => handleNavigation('/alerts', 0)}
                accessibilityLabel="Fire Alerts"
              >
                <View className="w-12 h-12 bg-red-600/20 rounded-lg items-center justify-center">
                  <Bell size={24} color="#dc2626" />
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-800">Alerts</Text>
                  <Text className="text-sm text-gray-600">Fire warnings and updates</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Report Fire Card */}
            <Animated.View
              className="w-[48%] mb-4"
              entering={FadeInDown.delay(200).duration(500)}
            >
              <TouchableOpacity
                className="bg-orange-50 p-5 rounded-xl shadow-md flex-col justify-between h-36"
                style={getCardStyle(1)}
                onPress={() => handleNavigation('/report', 1)}
                accessibilityLabel="Report Fire"
              >
                <View className="w-12 h-12 bg-orange-500/20 rounded-lg items-center justify-center">
                  <AlertTriangle size={24} color="#f97316" />
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-800">Report</Text>
                  <Text className="text-sm text-gray-600">Submit fire sightings</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Safety Tips Card */}
            <Animated.View
              className="w-[48%] mb-4"
              entering={FadeInDown.delay(300).duration(500)}
            >
              <TouchableOpacity
                className="bg-blue-50 p-5 rounded-xl shadow-md flex-col justify-between h-36"
                style={getCardStyle(2)}
                onPress={() => handleNavigation('/safety', 2)}
                accessibilityLabel="Safety Tips"
              >
                <View className="w-12 h-12 bg-blue-600/20 rounded-lg items-center justify-center">
                  <Shield size={24} color="#2563eb" />
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-800">Safety</Text>
                  <Text className="text-sm text-gray-600">Prevention and preparation</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Emergency Contacts Card */}
            <View
              className="w-[48%] mb-4"
            >
              <TouchableOpacity
                className="bg-purple-50 p-5 rounded-xl shadow-md flex-col justify-between h-36"
                style={getCardStyle(3)}
                onPress={() => handleNavigation('/emergency', 3)}
                accessibilityLabel="Emergency Contact"
              >
                <View className="w-12 h-12 bg-purple-600/20 rounded-lg items-center justify-center">
                  <Phone size={24} color="#9333ea" />
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-800">Call Help</Text>
                  <Text className="text-sm text-gray-600">Emergency services</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency Call Banner */}
          <Animated.View
            className="mt-2 mx-2 mb-4"
            entering={FadeInDown.delay(500).duration(500)}
          >
            <View className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-xl">
              <View className="flex-row justify-between items-center">
                <Text className="text-white font-semibold text-base">Emergency? Call directly</Text>
                <TouchableOpacity
                  className="bg-white/20 py-2 px-4 rounded-full"
                  onPress={() => router.push('/call-emergency')}
                  accessibilityLabel="Call emergency number 911"
                >
                  <Text className="text-white font-bold text-base">911</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}