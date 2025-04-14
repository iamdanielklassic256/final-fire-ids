import { View, Text, Image, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import React from 'react';
import logo from '../assets/logo/logo.png';
import { router } from 'expo-router';

const WelcomeScreen = () => {
  const handleRoute = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-gray-900">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <View className="flex-1 justify-between py-10">
            {/* Logo */}
            <View className="items-center mb-10">
              <Image
                source={logo}
                className="bg-white w-40 h-40 rounded-full"
                resizeMode="contain"
              />
             
            </View>

            {/* Hero Text */}
            <View className="mb-12">
              <Text className="text-white text-center text-2xl font-extrabold leading-tight mb-4">
                Welcome to {"\n"}Bible Church Connect.
              </Text>
              <Text className="text-gray-400 text-center text-base leading-6">
                Explore the Bible, reflect daily, listen to the Word, and grow with a global faith community — all in one place.
              </Text>
            </View>

            {/* CTA */}
            <View className="space-y-4">
              <TouchableOpacity
                onPress={handleRoute}
                className="bg-[#f27c22] py-4 rounded-xl shadow-xl"
              >
                <Text className="text-white text-center text-lg font-bold">Get Started</Text>
              </TouchableOpacity>

              
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default WelcomeScreen;