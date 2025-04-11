import { View, Text } from 'react-native'
import React from 'react'

const SettingSection = ({ title, children }) => (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
      <View className="bg-white rounded-xl shadow-sm overflow-hidden">
        {children}
      </View>
    </View>
  );

export default SettingSection