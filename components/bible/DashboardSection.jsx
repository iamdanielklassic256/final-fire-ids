import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react-native';
import bibledata from '../../data/bible/bible.json';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DashboardSection = ({ handleReadBible, navigation }) => {
  const [dailyVerse, setDailyVerse] = useState({
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengtheneth me."
  });

  // Find KJV version from the Bible data
  const getKJVBible = () => {
    return bibledata.versions.find(version => version.name === "KJV");
  };

  // Get a random verse from the KJV Bible
  const getRandomVerse = () => {
    const kjvBible = getKJVBible();
    if (!kjvBible) return null;

    // Select a random book
    const randomBookIndex = Math.floor(Math.random() * kjvBible.books.length);
    const randomBook = kjvBible.books[randomBookIndex];

    // Select a random chapter
    const randomChapterIndex = Math.floor(Math.random() * randomBook.chapters.length);
    const randomChapter = randomBook.chapters[randomChapterIndex];

    // Select a random verse
    const randomVerseIndex = Math.floor(Math.random() * randomChapter.verses.length);
    const randomVerse = randomChapter.verses[randomVerseIndex];

    return {
      reference: `${randomBook.name} ${randomChapter.number}:${randomVerse.number}`,
      text: randomVerse.text
    };
  };

  // Check if we need a new daily verse
  const checkAndUpdateDailyVerse = async () => {
    try {
      const storedVerseData = await AsyncStorage.getItem('dailyVerse');
      const currentDate = new Date().toDateString();

      if (storedVerseData) {
        const { verse, date } = JSON.parse(storedVerseData);
        
        // If the stored verse is from today, use it
        if (date === currentDate) {
          setDailyVerse(verse);
          return;
        }
      }

      // Generate a new verse for today
      const newVerse = getRandomVerse();
      if (newVerse) {
        setDailyVerse(newVerse);
        await AsyncStorage.setItem('dailyVerse', JSON.stringify({
          verse: newVerse,
          date: currentDate
        }));
        
        // Schedule a notification with the new verse
        await scheduleDailyVerseNotification(newVerse);
      }
    } catch (error) {
      console.error('Error updating daily verse:', error);
    }
  };

  // Schedule a notification with the daily verse
  const scheduleDailyVerseNotification = async (verse) => {
    try {
      // Cancel any existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Schedule a notification for tomorrow morning
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0); // 8:00 AM

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Bible Verse',
          body: `"${verse.text}" - ${verse.reference}`,
        },
        trigger: {
          date: tomorrow,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  // Request notification permissions
  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

  // Initialize daily verse and notifications on component mount
  useEffect(() => {
    const initializeApp = async () => {
      await requestNotificationPermissions();
      await checkAndUpdateDailyVerse();
    };

    initializeApp();
    
    // Set up a listener to refresh the verse at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeToMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      checkAndUpdateDailyVerse();
    }, timeToMidnight);
    
    return () => clearTimeout(midnightTimer);
  }, []);

  const quickActions = [
    { title: 'Read Bible', icon: BookOpen, onPress: handleReadBible, color: 'bg-blue-600' },
  ];

  const refreshDailyVerse = async () => {
    const newVerse = getRandomVerse();
    if (newVerse) {
      setDailyVerse(newVerse);
      const currentDate = new Date().toDateString();
      await AsyncStorage.setItem('dailyVerse', JSON.stringify({
        verse: newVerse,
        date: currentDate
      }));
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Daily Verse Card - Enhanced with background gradient effect */}
      <View className="mx-4 mb-6 rounded-xl overflow-hidden">
        <View className="p-5 bg-gray-800 border-l-4 border-blue-500">
          <Text className="text-white text-lg font-medium mb-3" style={{ lineHeight: 26 }}>
            "{dailyVerse.text}"
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-blue-400 font-bold">{dailyVerse.reference}</Text>
            <TouchableOpacity onPress={refreshDailyVerse}>
              <Text className="text-gray-400">Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Actions - Grid Layout */}
      <View className="px-4 mb-6">
        <Text className="text-gray-400 font-medium mb-3 px-2">QUICK ACCESS</Text>
        <View className="flex-row flex-wrap justify-between">
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              className={`${action.color} rounded-xl p-4 mb-3 items-center justify-center`}
              style={{ width: '48%', height: 90 }}
              onPress={action.onPress}
            >
              <action.icon size={28} color="white" />
              <Text className="text-white text-base font-medium mt-2">{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardSection;