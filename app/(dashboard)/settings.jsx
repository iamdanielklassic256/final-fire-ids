import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { User, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';

const SettingScreen = ({ navigation }) => {
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
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className=" ">
        <Text className="text-white text-2xl font-bold text-center">Settings</Text>
      </View>
      
      <View className="mx-5 mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <View className="items-center py-6 border-b border-gray-100">
          <View className="w-20 h-20 rounded-full bg-orange-100 items-center justify-center mb-3">
            <User size={40} color="#FF4500" />
          </View>
          
          <Text className="text-xl font-bold text-gray-800">{userData.name}</Text>
          <Text className="text-gray-500">{userData.email}</Text>
        </View>
      </View>
      
      <View className="px-5 mt-6">
        <TouchableOpacity 
          className="bg-red-500 py-4 rounded-xl flex-row justify-center items-center" 
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