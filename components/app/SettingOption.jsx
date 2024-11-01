import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const SettingOption = ({ title, icon, subtitle, onPress }) => {
	return (
		<TouchableOpacity
			className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm"
			onPress={onPress}
		>
			<View className="w-10 h-10 bg-[#028758]/10 rounded-full items-center justify-center mr-4">
				<Ionicons name={icon} size={20} color="#028758" />
			</View>
			<View className="flex-1">
				<Text className="text-lg font-semibold text-gray-800">{title}</Text>
				{subtitle && (
					<Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
				)}
			</View>
			<Ionicons name="chevron-forward" size={20} color="#4a008f" />
		</TouchableOpacity>
	)
}

export default SettingOption