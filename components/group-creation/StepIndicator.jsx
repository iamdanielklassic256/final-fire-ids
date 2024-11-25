import { View, Text } from 'react-native'
import React from 'react'

const StepIndicator = ({ isCompleted, isActive, step, isLocked }) => {
	return (
		<View
			className={`w-8 h-8 rounded-full items-center justify-center
      ${isCompleted ? 'bg-green-500' :
					isLocked ? 'bg-gray-300' :
						isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
		>
			{isLocked ? (
				<Text className="text-white text-lg">🔒</Text>
			) : (
				<Text className="text-white font-bold">
					{isCompleted ? '✓' : step + 1}
				</Text>
			)}
		</View>
	)
}

export default StepIndicator