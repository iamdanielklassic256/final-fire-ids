import { View, Text, Image, ActivityIndicator, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const InfoRow = ({ icon, label, value }) => (
	<View className="flex-row items-center mb-4 pb-2 border-b border-gray-100">
		<View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center mr-3">
			<Ionicons name={icon} size={16} color="#f27c22" />
		</View>
		<View className="flex-1">
			<Text className="text-xs text-gray-500">{label}</Text>
			<Text className="text-sm text-gray-800 font-medium">{value}</Text>
		</View>
	</View>
);

const ProfileScreen = () => {
	const [user, setUser] = useState(null);
	const [loadingUser, setLoadingUser] = useState(true);
	const insets = useSafeAreaInsets();

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

	if (loadingUser) {
		return (
			<View className="flex-1 justify-center items-center bg-gray-50">
				<StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
				<ActivityIndicator size="large" color="#4B7BE5" />
			</View>
		);
	}

	if (!user) {
		return (
			<View className="flex-1 justify-center items-center bg-gray-50">
				<StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
				<Ionicons name="person-outline" size={48} color="#CBD5E1" />
				<Text className="text-gray-500 mt-4">No user data found</Text>
			</View>
		);
	}

	const { name, email, contact, image, title, dob } = user;
	const formattedDob = new Date(dob).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<>
			<ScrollView className="flex-1 bg-gray-100">
				{/* Header Section with Safe Area Insets handling */}
				<View style={{ height: 40 + insets.top }} className="bg-[#f27c22]" />
				<View className="h-28 bg-[#f27c22]" />

				{/* Profile Section */}
				<View className="px-4 -mt-32">
					<View className="bg-white rounded-2xl shadow-sm overflow-hidden pb-6">
						{/* Back Button */}
						<TouchableOpacity
							onPress={() => router.back()}
							className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full"
						>
							<Ionicons name="arrow-back" size={24} color="#f27c22" />
						</TouchableOpacity>

						{/* Profile Image and Actions */}
						<View className="items-center relative">
							<Image
								source={{ uri: image }}
								className="w-28 h-28 rounded-full border-4 border-white mt-4"
							/>
							<Text className="text-xl font-bold text-gray-800 mt-2">{name}</Text>
							<Text className="text-sm text-gray-500">{title}</Text>
						</View>
					</View>
				</View>

				{/* Information Section */}
				<View className="mt-4 px-4 mb-8">
					<View className="bg-white rounded-2xl shadow-sm p-4">
						<Text className="text-lg font-bold text-gray-800 mb-4 px-2">Personal Information</Text>

						<InfoRow
							icon="mail-outline"
							label="Email Address"
							value={email}
						/>

						<InfoRow
							icon="call-outline"
							label="Phone Number"
							value={contact}
						/>

						<InfoRow
							icon="calendar-outline"
							label="Date of Birth"
							value={formattedDob}
						/>
					</View>
				</View>
			</ScrollView>
		</>
	);
};

export default ProfileScreen;