import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext'; // adjust if needed

const SettingItem = ({ icon, title, description, action, handlePath }) => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === 'dark';

  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-100';
  const titleText = darkMode ? 'text-gray-100' : 'text-gray-800';
  const descText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const iconBg = darkMode ? 'bg-gray-900' : 'bg-indigo-100';
  const iconColor = darkMode ? 'white' : '#4F46E5';

  return (
    <TouchableOpacity onPress={handlePath}>
      <View className={`flex-row items-center px-4 py-3 border-b ${borderColor}`}>
        <View className={`w-8 h-8 rounded-full ${iconBg} items-center justify-center mr-3`}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className={`text-base font-medium ${titleText}`}>{title}</Text>
          {description && <Text className={`text-sm ${descText}`}>{description}</Text>}
        </View>
        {action}
      </View>
    </TouchableOpacity>
  );
};

export default SettingItem;
