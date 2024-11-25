import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const GroupCreationCard = () => {

	const handleCreateGroup = () => {
		router.push("/create-saving-group");
	};

	return (
		<View className="bg-white border-2 border-[#028758] rounded-xl p-4 mt-6 shadow-sm">
			<Text className="text-lg font-semibold text-gray-800">Create a Savings Group</Text>
			<Text className="text-gray-600 mt-2 mb-4">
				Start a new savings group with other SACCO members. Pool resources together,
				set group goals, and achieve more through collective saving and borrowing.
			</Text>

			<TouchableOpacity
				onPress={handleCreateGroup}
				className="bg-[#111827] rounded-lg py-3 flex-row items-center justify-center"
			>
				<Ionicons name="people-outline" size={24} color="#ffffff" />
				<Text className="text-white font-semibold ml-2">Create New Savings Group</Text>
			</TouchableOpacity>
		</View>
	)
}

export default GroupCreationCard