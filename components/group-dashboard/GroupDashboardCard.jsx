import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { router } from 'expo-router'

const GroupDashboardCard = ({ group }) => {
	// console.log(group)
	return (
		<TouchableOpacity
			key={group.id}
			className="bg-[#028758] rounded-3xl p-6 mb-4 border-2 border-white/20 shadow-2xl"
			onPress={() => router.push(`/group/${group.id}`)}
		>
			<View className="flex-row justify-between items-center mb-3">
				<View className="flex-row  bg-white/20 rounded-xl ">
					<MaterialCommunityIcons name="account-group" size={24} color="white" />
					
				</View>
				<Text className="text-white font-bold text-xl mb-2">{group.name}</Text>
			</View>
			<View className="flex-row justify-between items-center">
				<View className="flex-row items-center space-x-2">
					<Ionicons name="people" size={16} color="white" />
					<Text className="text-white/90 text-sm">
						{group.totalMembers} Members
					</Text>
				</View>
				<View className="flex-row items-center">
					<Text className="text-white/90 mr-2 text-sm">Details</Text>
					<Ionicons name="chevron-forward" size={20} color="white" />
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default GroupDashboardCard