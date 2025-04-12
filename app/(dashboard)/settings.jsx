import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Switch } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import SettingSection from '../../components/settings/SettingSection';
import SettingItem from '../../components/settings/SettingItem';
import SettingArrow from '../../components/settings/SettingArrow';
import { router } from 'expo-router';
import { handleLogout } from '../../utils/logout';
import { ThemeContext } from '../../context/ThemeContext'; // <- Update this path as needed

const SettingScreen = () => {

  const { theme, toggleTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark';

  const [isDarkMode, setIsDarkMode] = useState(darkMode);

  useEffect(() => {
    setIsDarkMode(darkMode);
  }, [theme]);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handlePersonalDetails = () => {
    router.push('/profile');
  };

  const handlePinChange = () => {
    router.push('/pin-change');
  };

  const handleAboutApp = () => {
    router.push('/about-app');
  };

  const handleBack = () => {
    router.back();
  };

  const SettingToggle = ({ value, onValueChange }) => (
    <Switch
      trackColor={{ false: "#d1d5db", true: "#f27c22" }}
      thumbColor={value ? "#ffffff" : "#ffffff"}
      ios_backgroundColor="#d1d5db"
      onValueChange={onValueChange}
      value={value}
    />
  );

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
  const cardColor = darkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      {/* Header */}
      <View className={`px-6 pt-8 pb-4 flex-row items-center justify-between ${cardColor} shadow-sm`}>
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#f27c22" />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${textColor}`}>Settings</Text>
        <View className="w-10" />
      </View>

      {/* Scroll content */}
      <ScrollView className="flex-1 px-6 mt-4">
        <SettingSection title="Account">
          <SettingItem
            icon="person-outline"
            title="Personal Information"
            description="View your profile details"
            action={<SettingArrow />}
            handlePath={handlePersonalDetails}
          />
          <SettingItem
            icon="key-outline"
            title="Change PINCODE"
            description="Update your security credentials"
            action={<SettingArrow />}
            handlePath={handlePinChange}
          />
        </SettingSection>

        <SettingSection title="App Preferences">
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            description="Switch to dark theme"
            action={<SettingToggle value={isDarkMode} onValueChange={handleThemeToggle} />}
          />
          <SettingItem
            icon="globe-outline"
            title="Language"
            description="English"
            action={<SettingArrow />}
          />
        </SettingSection>

        <SettingSection title="Support">
          <SettingItem
            icon="information-circle-outline"
            title="About"
            description="App version 1.0.0"
            action={<SettingArrow />}
            handlePath={handleAboutApp}
          />
        </SettingSection>

        <TouchableOpacity
          className="mt-0 mb-12 bg-red-50 py-4 rounded-xl border border-red-100 shadow-sm"
          onPress={handleLogout}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text className="text-red-600 font-medium text-center ml-2">Sign Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;
