import {
  SafeAreaView,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import WelcomeUser from '../../components/home/WelcomeUser';

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
      router.replace('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <WelcomeUser
        handleLogout={handleLogout}
        user={user}
        loadingUser={loadingUser}
      />

    </SafeAreaView>
  );
};

export default DashboardScreen;