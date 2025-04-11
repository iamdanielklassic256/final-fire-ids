import {
	View,
	TouchableOpacity,
	Image,
	Text,
	ActivityIndicator,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { Ionicons } from '@expo/vector-icons';
  import { LinearGradient } from 'expo-linear-gradient';
import { handleLogout } from '../../utils/logout';
  
  const WelcomeUser = ({ user, loadingUser }) => {
	const [greeting, setGreeting] = useState('');
	const [greetingIcon, setGreetingIcon] = useState('');
	const [gradientColors, setGradientColors] = useState(['#111827', '#111827']);
	const [currentTime, setCurrentTime] = useState('');
  
	useEffect(() => {
	  determineGreeting();
	  const now = new Date();
	  setCurrentTime(
		now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	  );
  
	  // Update time every minute
	  const interval = setInterval(() => {
		const now = new Date();
		setCurrentTime(
		  now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		);
		determineGreeting();
	  }, 60000);
  
	  return () => clearInterval(interval);
	}, []);
  
	const determineGreeting = () => {
	  const currentHour = new Date().getHours();
	  
	  if (currentHour >= 5 && currentHour < 12) {
		setGreeting('Good Morning');
		setGreetingIcon('sunny-outline');
		setGradientColors(['#4F46E5', '#3730A3']);
	  } else if (currentHour >= 12 && currentHour < 17) {
		setGreeting('Good Afternoon');
		setGreetingIcon('partly-sunny-outline');
		setGradientColors(['#2563EB', '#1D4ED8']);
	  } else if (currentHour >= 17 && currentHour < 21) {
		setGreeting('Good Evening');
		setGreetingIcon('moon-outline');
		setGradientColors(['#6366F1', '#4F46E5']);
	  } else {
		setGreeting('Good Night');
		setGreetingIcon('star-outline');
		setGradientColors(['#312E81', '#1E1B4B']);
	  }
	};
  
	const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
	const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
	return (
	  <LinearGradient
		colors={gradientColors}
		start={{ x: 0, y: 0 }}
		end={{ x: 1, y: 0 }}
		className="m-2 rounded-2xl overflow-hidden shadow-lg"
	  >
		<View className="px-6 pt-6 pb-4">
		  <View className="flex-row justify-between items-center mb-4">
			<View className="flex-row items-center">
			  <Ionicons name={greetingIcon} size={22} color="#FFF" />
			  <Text className="text-gray-200 text-base ml-2">{currentTime}</Text>
			</View>
			<View className="flex-row items-center">
			  <Ionicons name="calendar-outline" size={16} color="#FFF" />
			  <Text className="text-gray-300 text-xs ml-1">{dayOfWeek}, {date}</Text>
			</View>
		  </View>
  
		  {loadingUser ? (
			<View className="py-4 items-center">
			  <ActivityIndicator size="small" color="#A5B4FC" />
			</View>
		  ) : user ? (
			<View className="flex-row justify-between items-center">
			  <View className="flex-1">
				<Text className="text-indigo-200 text-lg font-medium mb-1">{greeting},</Text>
				<Text className="text-lg font-bold text-white mb-1">
				  {user.name}
				</Text>
				<Text className="text-sm uppercase tracking-wide text-indigo-200">{user.title || 'Church Member'}</Text>
				<View className="flex-row items-center mt-2">
				  
				  {user?.lastSeen && (
					<View className="flex-row items-center">
					  <View className="w-2 h-2 rounded-full bg-green-400 mr-1"></View>
					  <Text className="text-xs text-gray-300">Active Now</Text>
					</View>
				  )}
				</View>
			  </View>
			  <View className="items-center">
				{user?.image ? (
				  <Image
					source={{ uri: user.image }}
					className="w-16 h-16 rounded-full border-2 border-indigo-200"
					resizeMode="cover"
				  />
				) : (
				  <View className="w-16 h-16 rounded-full bg-indigo-700 items-center justify-center border-2 border-indigo-200">
					<Text className="text-xl font-bold text-white">
					  {user?.name ? user.name.charAt(0) : "G"}
					</Text>
				  </View>
				)}
				
			  </View>
			</View>
		  ) : (
			<View className="py-4 items-center">
			  <Text className="text-red-400 font-medium">Failed to load user</Text>
			  <TouchableOpacity 
				className="mt-2 bg-indigo-700 px-4 py-2 rounded-lg" 
				onPress={() => handleLogout()}
			  >
				<Text className="text-white font-medium">Retry</Text>
			  </TouchableOpacity>
			</View>
		  )}
		</View>
	  </LinearGradient>
	);
  };
  export default WelcomeUser;