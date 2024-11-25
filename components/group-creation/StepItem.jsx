import { View, Text } from 'react-native'
import React from 'react'
import StepIndicator from './StepIndicator'
import { TouchableOpacity } from 'react-native'

const StepItem = ({index, step, stepsCompleted, currentStep, handleStepClick, isLocked}) => {
	return (
		<TouchableOpacity
		key={index}
		className={`flex-row items-center p-4 rounded-xl mb-4 
		${isLocked ? 'bg-gray-100 border border-gray-200' :
			stepsCompleted[index] ? 'bg-green-50 border border-green-200' :
			  index === currentStep ? 'bg-blue-50 border border-blue-200' :
				'bg-white border border-gray-200'}
		shadow-sm relative`}
		onPress={() => handleStepClick(index)}
	  >
		<StepIndicator
		  step={index}
		  isCompleted={stepsCompleted[index]}
		  isActive={index === currentStep}
		  isLocked={isLocked}
		/>
		<View className="ml-4 flex-1">
		  <View className="flex-row items-center">
			<Text className={`text-lg font-semibold 
			  ${isLocked ? 'text-gray-500' :
				stepsCompleted[index] ? 'text-green-800' :
				  'text-gray-800'}`}>
			  {step}
			</Text>
			{isLocked && (
			  <View className="ml-2 bg-gray-200 px-2 py-1 rounded">
				<Text className="text-xs text-gray-600">Locked</Text>
			  </View>
			)}
		  </View>
		  <Text className={`text-sm mt-1 ${isLocked ? 'text-gray-500' : 'text-gray-600'}`}>
			{index === 0 ? 'Basic information about your group' :
			  index === 1 ? 'Define share value and units' :
				'Set loan terms and conditions'}
		  </Text>
		  {isLocked && (
			<Text className="text-xs text-red-500 mt-1">
			  Complete Step {index} first
			</Text>
		  )}
		</View>
	  </TouchableOpacity>
	)
}

export default StepItem