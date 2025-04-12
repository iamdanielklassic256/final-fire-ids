import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext'; // Adjust path if needed

const SettingSection = ({ title, children }) => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === 'dark';

  const titleTextColor = darkMode ? 'text-white' : 'text-gray-800';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <View className="mb-6">
      <Text className={`text-lg font-bold mb-2 ${titleTextColor}`}>{title}</Text>
      <View className={`rounded-xl shadow-sm overflow-hidden ${cardBg}`}>
        {children}
      </View>
    </View>
  );
};

export default SettingSection;
