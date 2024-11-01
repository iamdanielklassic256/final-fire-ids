import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const Benefits = () => {
	return (
		<View className="bg-white/20 rounded-2xl p-6">
			<Text className="text-white text-lg font-bold mb-4">
				Benefits of Verification
			</Text>
			{[
				{ icon: "shield-outline", text: "Enhanced account security" },
				{ icon: "card-outline", text: "Access to all financial services" },
				{ icon: "flash-outline", text: "Faster transactions" },
				{ icon: "gift-outline", text: "Special promotions and offers" }
			].map((benefit, index) => (
				<View key={index} className="flex-row items-center mb-3">
					<Ionicons name={benefit.icon} size={24} color="white" />
					<Text className="text-white ml-3">{benefit.text}</Text>
				</View>
			))}
		</View>
	)
}

export default Benefits