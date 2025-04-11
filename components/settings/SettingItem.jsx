import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const SettingItem = ({ icon, title, description, action, handlePath }) => (
  <TouchableOpacity
    onPress={handlePath}
  >
    <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
      <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color="#4F46E5" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800">{title}</Text>
        {description && <Text className="text-sm text-gray-500">{description}</Text>}
      </View>
      {action}
    </View>
  </TouchableOpacity>
);

export default SettingItem