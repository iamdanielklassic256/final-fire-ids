import { View, Text } from 'react-native'
import React from 'react'

const LockedStepMessage = () => {
	return (
		<View className="absolute top-1/3 left-4 right-4 bg-gray-800 rounded-lg p-4 z-50 shadow-lg">
			<View className="items-center">
				<Text className="text-white text-lg font-semibold mb-2">
					🔒 Step Locked
				</Text>
				<Text className="text-white text-center">
					Please complete the previous step first to unlock this section
				</Text>
			</View>
		</View>
	)
}

export default LockedStepMessage