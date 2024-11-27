import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';

const GroupItem = ({ item, getMemberCount, router }) => {
	return (
		<TouchableOpacity
			className="flex-row justify-between items-center bg-white rounded-lg mx-4 mt-3 p-4 mb-3 shadow-md"
			onPress={() => router.push(`/group-profile/${item.id}`)}
		>
			<View className="flex-1 mr-3">
				<Text className="text-lg font-bold text-gray-800 mb-1">{item.name}</Text>
				<Text className="text-gray-600 mb-2" numberOfLines={2}>
					{item.description}
				</Text>
				<View className="flex-row justify-between">
					<View className="flex-row items-center">
						<Text className="ml-1 text-gray-600 text-xs">
							Share Price {item.price_per_share ? item.price_per_share.toLocaleString() : '0'}
						</Text>
					</View>
					<View className="flex-row items-center">
						<Feather name="users" size={16} color="#4A5568" />
						<Text className="ml-1 text-gray-600 text-xs">
							Members: {getMemberCount(item)}
						</Text>
					</View>
				</View>
			</View>
			<Feather name="chevron-right" size={24} color="#4A5568" />
		</TouchableOpacity>
	)
}

export default GroupItem