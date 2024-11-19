import { View, Text } from 'react-native'
import React from 'react'

const MainGroupDashboard = ({ group }) => {
	return (
		<View className="p-4">
			<Text className="text-2xl font-bold">Group Dashboard</Text>
			{/* Add dashboard specific content */}
			<Text>{group?.name} Group Overview</Text>
		</View>
	)
}

export default MainGroupDashboard