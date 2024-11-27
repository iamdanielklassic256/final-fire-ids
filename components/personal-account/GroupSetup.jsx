import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const GroupSetup = ({ currentView, stepsCompleted, updateLoading, handleUpdateGroup, renderSteps, renderStepContent }) => {
	return (
		<>
			{currentView === "steps" ? renderSteps() : renderStepContent()}
			{stepsCompleted && stepsCompleted.every((step) => step) && (
				<View className="fixed items-center justify-center bottom-2 left-0 right-0 px-14 mx-4 p-4 z-10 bg-[#111827] rounded-lg">
					<TouchableOpacity
						onPress={handleUpdateGroup}
						className=""
					>
						<Text className="text-white text-center font-semibold text-lg">
							{updateLoading ? <ActivityIndicator color="white" /> : "Update Saving Group"}
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</>
	)
}

export default GroupSetup