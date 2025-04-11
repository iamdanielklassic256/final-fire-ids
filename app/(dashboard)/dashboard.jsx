import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample data
  const upcomingAppointments = [
    {
      id: 1,
      title: 'Weekly Staff Meeting',
      date: 'Today, 10:00 AM',
      location: 'Conference Room A'
    },
    {
      id: 2,
      title: 'Budget Review',
      date: 'Tomorrow, 2:30 PM',
      location: 'Virtual Meeting'
    }
  ];

  const quickStats = [
    { id: 1, title: 'Members', value: '248', icon: 'people', color: '#4ECDC4' },
    { id: 2, title: 'Events', value: '12', icon: 'calendar', color: '#FF6B6B' },
    { id: 3, title: 'Donations', value: '$5,840', icon: 'cash', color: '#FF9F1C' },
    { id: 4, title: 'Tasks', value: '24', icon: 'checkmark-circle', color: '#6A0572' },
  ];

  // Fetch user data from AsyncStorage on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        
        // Get the access token
        const token = await AsyncStorage.getItem('accessToken');
        console.log('Access token retrieved:', token ? 'Token exists' : 'No token');
        
        // Get the user data
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const parsedUserData = JSON.parse(userDataString);
          console.log('User data retrieved successfully');
          setUserData(parsedUserData);
        } else {
          console.log('No user data found');
          // Redirect to login if no user data is found
          // router.replace('/sign-in');
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all data from AsyncStorage
      await AsyncStorage.multiRemove(['accessToken', 'userData', 'userEmail']);
      
      // Navigate to login screen
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#f27c22" />
        <Text className="mt-4 text-gray-600">Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-4 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-sm">Welcome</Text>
          <Text className="text-2xl font-bold text-gray-900">{userData?.name || 'User'}</Text>
          <Text className="text-sm text-gray-500">{userData?.title || 'Member'}</Text>
        </View>
        <TouchableOpacity 
          onPress={handleLogout}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="log-out-outline" size={22} color="#4A5568" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 pt-4" showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View className="mx-6 bg-[#f27c22] bg-opacity-10 rounded-2xl p-5 mb-6">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-[#f27c22] bg-opacity-20 items-center justify-center mr-4">
              <Text className="text-2xl font-bold text-[#f27c22]">
                {userData?.name ? userData.name.charAt(0) : 'U'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">{userData?.name || 'User'}</Text>
              <Text className="text-sm text-gray-600">{userData?.email || 'No email'}</Text>
              <Text className="text-sm text-gray-600">{userData?.contact || 'No contact'}</Text>
            </View>
          </View>
          <View className="mt-4 pt-4 border-t border-gray-200 border-opacity-30">
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="person-outline" size={16} color="#f27c22" />
              <Text className="ml-2 text-[#f27c22] font-medium">View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickStats.map(stat => (
              <View key={stat.id} className="bg-gray-50 w-[48%] rounded-xl p-4 mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-gray-500">{stat.title}</Text>
                  <View style={{ backgroundColor: `${stat.color}20` }} className="w-8 h-8 rounded-full items-center justify-center">
                    <Ionicons name={stat.icon} size={16} color={stat.color} />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-gray-900">{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">Quick Actions</Text>
            <TouchableOpacity>
              <Text className="text-sm text-[#f27c22]">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-blue-50 w-24 h-24 rounded-xl items-center justify-center">
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
                <Ionicons name="people-outline" size={22} color="#4299E1" />
              </View>
              <Text className="text-sm font-medium text-gray-700">Members</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-green-50 w-24 h-24 rounded-xl items-center justify-center">
              <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-2">
                <Ionicons name="calendar-outline" size={22} color="#48BB78" />
              </View>
              <Text className="text-sm font-medium text-gray-700">Events</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-purple-50 w-24 h-24 rounded-xl items-center justify-center">
              <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mb-2">
                <Ionicons name="document-text-outline" size={22} color="#805AD5" />
              </View>
              <Text className="text-sm font-medium text-gray-700">Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Events/Meetings */}
        <View className="px-6 py-4 mb-8">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">Upcoming Events</Text>
            <TouchableOpacity>
              <Text className="text-sm text-[#f27c22]">See All</Text>
            </TouchableOpacity>
          </View>

          {upcomingAppointments.map(event => (
            <TouchableOpacity
              key={event.id}
              className="bg-gray-50 rounded-xl p-4 mb-4"
            >
              <Text className="text-base font-semibold text-gray-900">{event.title}</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="time-outline" size={14} color="#718096" />
                <Text className="text-xs text-gray-500 ml-1">{event.date}</Text>
              </View>
              <View className="flex-row items-center mt-1">
                <Ionicons name="location-outline" size={14} color="#718096" />
                <Text className="text-xs text-gray-500 ml-1">{event.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center px-8 py-4 bg-white border-t border-gray-100">
        {['Home', 'Calendar', 'Messages', 'Profile'].map((tab) => (
          <TouchableOpacity
            key={tab}
            className="items-center"
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
              name={getIconName(tab, activeTab)}
              size={24}
              color={activeTab === tab ? '#f27c22' : '#A0AEC0'}
            />
            <Text
              className={`text-xs mt-1 ${
                activeTab === tab ? 'text-[#f27c22] font-medium' : 'text-gray-400'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

// Helper function to get icon names
const getIconName = (tab, activeTab) => {
  const isActive = tab === activeTab;
  switch (tab) {
    case 'Home':
      return isActive ? 'home' : 'home-outline';
    case 'Calendar':
      return isActive ? 'calendar' : 'calendar-outline';
    case 'Messages':
      return isActive ? 'chatbubble' : 'chatbubble-outline';
    case 'Profile':
      return isActive ? 'person' : 'person-outline';
    default:
      return 'help-circle-outline';
  }
};

export default DashboardScreen;