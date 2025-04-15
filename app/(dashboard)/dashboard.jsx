import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import logo from '../../assets/logo/logo.png';

const DashboardScreen = () => {
  const [currentDate] = useState(new Date());

  // Format date: Monday, April 14
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Sample data
  const dailyVerse = {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me."
  };

  const devotionals = [
    {
      id: 1,
      title: "Finding Peace",
      verse: "John 14:27",
      duration: "5 min"
    },
    {
      id: 2,
      title: "Faith Over Fear",
      verse: "Isaiah 41:10",
      duration: "7 min"
    },
    {
      id: 3,
      title: "Daily Strength",
      verse: "Psalm 46:1",
      duration: "4 min"
    }
  ];

  const readingPlans = [
    {
      id: 1,
      title: "21 Days of Prayer",
      progress: 60,
      days: "12/21"
    },
    {
      id: 2,
      title: "Psalms of Comfort",
      progress: 30,
      days: "9/30"
    },
    {
      id: 3,
      title: "New Testament Journey",
      progress: 15,
      days: "27/180"
    }
  ];

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-black/40">
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 pt-4 pb-6">
            <View>
              <Text className="text-white text-xl font-bold">Welcome back</Text>
              <Text className="text-gray-400">{formattedDate}</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-4">
                <View className="bg-gray-800 w-10 h-10 rounded-full items-center justify-center">
                  <Text className="text-white text-lg">🔍</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={logo}
                  className="w-10 h-10 rounded-full"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default DashboardScreen;