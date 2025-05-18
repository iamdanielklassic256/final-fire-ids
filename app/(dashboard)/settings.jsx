import { View, Text, SafeAreaView, TouchableOpacity, Alert, Switch } from 'react-native';
import React from 'react';
import { User, LogOut, Sun, Moon } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const SettingScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  // Mock user data - replace with your actual user authentication state
  const userData = {
    name: 'Okumu Daniel Comboni',
    email: 'okumucomboni@gmail.com'
  };

  // Handle logout action
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Add your logout logic here
            // For example: auth.signOut()

            // Navigate to login screen
            router.push('/sign-in')
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="py-4">
        <Text style={{ color: theme.text }} className="text-2xl font-bold text-center">
          Settings
        </Text>
      </View>

      <View style={{
        backgroundColor: theme.surface,
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 12,
        shadowColor: theme.text,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2
      }}>
        <View className="items-center py-6" style={{ borderBottomColor: theme.border, borderBottomWidth: 1 }}>
          <View className="w-20 h-20 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: theme.primaryLight }}>
            <User size={40} color={theme.primary} />
          </View>

          <Text style={{ color: theme.text }} className="text-xl font-bold">
            {userData.name}
          </Text>
          <Text style={{ color: theme.textSecondary }}>
            {userData.email}
          </Text>
        </View>
      </View>

      {/* Theme Toggle Section */}
      <View style={{
        backgroundColor: theme.surface,
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 12,
        shadowColor: theme.text,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2
      }}>
        <TouchableOpacity
          className="flex-row items-center justify-between p-4"
          style={{ borderBottomColor: theme.border, borderBottomWidth: 1 }}
          onPress={toggleTheme}
        >
          <View className="flex-row items-center">
            {isDarkMode ? (
              <Moon size={24} color={theme.primary} className="mr-3" />
            ) : (
              <Sun size={24} color={theme.primary} className="mr-3" />
            )}
            <View>
              <Text style={{ color: theme.text }} className="text-lg font-medium">
                Dark Mode
              </Text>
              <Text style={{ color: theme.textSecondary }} className="text-sm">
                {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: theme.primary }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </TouchableOpacity>
      </View>

      <View className="px-5 mt-6">
        <TouchableOpacity
          style={{ backgroundColor: theme.primary }}
          className="py-4 rounded-xl flex-row justify-center items-center"
          onPress={handleLogout}
        >
          <LogOut size={20} color="white" className="mr-2" />
          <Text className="text-white font-medium text-center">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;