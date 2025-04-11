import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const DashboardScreen = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData', 'userEmail']);
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4 flex-row justify-between items-center">
        {loadingUser ? (
          <ActivityIndicator size="small" color="#f27c22" />
        ) : user ? (
          <View className="flex-1">
            <Text className="text-gray-500 text-base mb-1">Welcome back,</Text>
            <Text className="text-xl font-semibold text-gray-900">
              {user.name}
            </Text>
            <Text className="text-sm text-gray-500 capitalize">{user.title}</Text>
            <Text className="text-xs text-orange-500 font-semibold mt-1 bg-orange-100 w-fit px-2 py-1 rounded-full">
              {user.role}
            </Text>
          </View>
        ) : (
          <Text className="text-red-500">Failed to load user</Text>
        )}

        {user?.image && (
          <Image
            source={{ uri: user.image }}
            className="w-12 h-12 rounded-full ml-4 border border-gray-300"
            resizeMode="cover"
          />
        )}

        <TouchableOpacity
          onPress={handleLogout}
          className="w-10 h-10 ml-3 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="log-out-outline" size={22} color="#4A5568" />
        </TouchableOpacity>
      </View>

      {/* Body content could go here */}
      <View className="mt-10 px-6">
        <Text className="text-lg font-bold text-gray-800">Dashboard</Text>
        <Text className="text-gray-500 mt-1">Here’s what’s happening today...</Text>
        {/* Add your dashboard stats, cards, or buttons here */}
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
