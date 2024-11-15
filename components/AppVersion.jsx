import { View, Text } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import Constants from 'expo-constants';

const AppVersion = () => {
	const appVersion = Constants.expoConfig?.version || "1.0.0";
	return (
		<View className="flex-row justify-center items-center">
			<MaterialIcons name="verified" size={16} color="#00E394" />
			<Text className="text-[#E0E0E0] text-xs ml-1">
				Version {appVersion}
			</Text>
		</View>
	)
}

export default AppVersion