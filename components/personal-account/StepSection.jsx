import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { group_creation_steps } from '../../data/data';
import StepItem from '../group-creation/StepItem';

const StepSection = ({ stepsCompleted, currentStep, handleStepClick, StepIndicator }) => {
	return (
		<ScrollView className="p-6">
			<View className="mb-8">
				<Text className="text-xl font-bold text-gray-800 mb-2">
					Let's get your group ready to save!
				</Text>
				<Text className="text-gray-600">Complete these steps in order to set up your group</Text>
			</View>

			{group_creation_steps.map((step, index) => {
				const isLocked = index > 0 && !stepsCompleted[index - 1];

				return (
					<StepItem
						currentStep={currentStep}
						key={index}
						index={index}
						handleStepClick={handleStepClick}
						step={step}
						isLocked={isLocked}
						StepIndicator={StepIndicator}
						stepsCompleted={stepsCompleted}
					/>

				);
			})}
		</ScrollView>
	)
}

export default StepSection