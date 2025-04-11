import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SettingHeader = () => {
  return (
    <View className="px-6 pt-6 pb-4">
      <View className="flex-row items-center mb-2">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={22} color="#4A5568" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
      </View>
      <Text className="text-base text-gray-500 ml-13">Configure your app preferences</Text>
    </View>
  );
};

export default SettingHeader;