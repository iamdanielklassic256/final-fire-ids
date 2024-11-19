import { View, Text } from 'react-native'
import React from 'react'

const GroupProfile = ({ group }) => {
	return (
		<View className="p-4">
			<Text className="text-2xl font-bold">Group Profile</Text>
			{/* Add group profile specific content */}
			<Text>Group Details: {group?.description}</Text>
		</View>
	)
}

export default GroupProfile