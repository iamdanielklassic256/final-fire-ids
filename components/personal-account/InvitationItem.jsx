import { View, Text } from 'react-native'
import React from 'react'

const InvitationItem = ({invitedGroup, handleInvitation, item}) => {
	return (
		<View className="bg-white rounded-lg shadow-lg m-3 p-5">
			<View className="flex-row justify-between items-center mb-4">
				<Text className="text-2xl font-bold text-purple-800">{invitedGroup.name}</Text>
				<View className="bg-yellow-100 px-2 py-1 rounded-lg">
					<Text className="text-yellow-800 text-sm">Pending</Text>
				</View>
			</View>
			<Text className="text-gray-600 mb-4 text-base">
				You've been invited to join <Text className="font-bold">{invitedGroup.name}</Text>. Do you want to accept the invitation?
			</Text>
			<View className="flex-row justify-between">
				<TouchableOpacity onPress={() => handleInvitation(item, 'approved')} className="bg-green-600 px-6 py-3 rounded-full mr-2 shadow-md">
					<Text className="text-white text-center font-semibold">Accept</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => handleInvitation(item, 'rejected')} className="bg-red-600 px-6 py-3 rounded-full ml-2 shadow-md">
					<Text className="text-white text-center font-semibold">Decline</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default InvitationItem