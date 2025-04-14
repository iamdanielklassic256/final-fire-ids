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

          {/* Daily Verse Card */}
          <View className="mx-6 bg-gray-900 rounded-2xl p-6 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-bold text-lg">Verse of the Day</Text>
              <TouchableOpacity>
                <Text className="text-orange-500">Share</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white text-xl mb-4 leading-7" style={{ lineHeight: 28 }}>
              "{dailyVerse.text}"
            </Text>
            <Text className="text-orange-500 text-right font-bold">{dailyVerse.reference}</Text>
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-between px-6 mb-8">
            <TouchableOpacity className="bg-gray-900 rounded-xl items-center justify-center py-4 px-2" style={{ width: '31%' }}>
              <View className="bg-orange-500/20 w-12 h-12 rounded-full items-center justify-center mb-2">
                <Text className="text-2xl">📖</Text>
              </View>
              <Text className="text-white text-sm">Read</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-gray-900 rounded-xl items-center justify-center py-4 px-2" style={{ width: '31%' }}>
              <View className="bg-orange-500/20 w-12 h-12 rounded-full items-center justify-center mb-2">
                <Text className="text-2xl">🎧</Text>
              </View>
              <Text className="text-white text-sm">Listen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-gray-900 rounded-xl items-center justify-center py-4 px-2" style={{ width: '31%' }}>
              <View className="bg-orange-500/20 w-12 h-12 rounded-full items-center justify-center mb-2">
                <Text className="text-2xl">✏️</Text>
              </View>
              <Text className="text-white text-sm">Journal</Text>
            </TouchableOpacity>
          </View>

          {/* Devotionals Section */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text className="text-white font-bold text-lg">Today's Devotionals</Text>
              <TouchableOpacity>
                <Text className="text-orange-500">See All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}>
              {devotionals.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  className="bg-gray-900 rounded-xl p-4 mr-4"
                  style={{ width: 180 }}
                >
                  <View className="flex-row items-center mb-2">
                    <View className="bg-orange-500 rounded-md p-1.5 mr-2">
                      <Text>📝</Text>
                    </View>
                    <Text className="text-gray-400 text-xs">{item.duration}</Text>
                  </View>
                  <Text className="text-white font-bold text-lg mb-1">{item.title}</Text>
                  <Text className="text-orange-400">{item.verse}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Reading Plans Section */}
          <View>
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text className="text-white font-bold text-lg">Reading Plans</Text>
              <TouchableOpacity>
                <Text className="text-orange-500">Browse</Text>
              </TouchableOpacity>
            </View>
            
            <View className="px-6">
              {readingPlans.map(plan => (
                <TouchableOpacity 
                  key={plan.id}
                  className="bg-gray-900 rounded-xl p-4 mb-4 flex-row justify-between items-center"
                >
                  <View className="flex-1 mr-4">
                    <Text className="text-white font-bold mb-2">{plan.title}</Text>
                    <View className="bg-gray-800 h-2 rounded-full overflow-hidden">
                      <View 
                        className="bg-orange-500 h-full rounded-full" 
                        style={{ width: `${plan.progress}%` }} 
                      />
                    </View>
                    <Text className="text-gray-400 text-xs mt-2">{plan.days} days completed</Text>
                  </View>
                  <View className="bg-orange-500/20 w-10 h-10 rounded-full items-center justify-center">
                    <Text className="text-white">▶️</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default DashboardScreen;