import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Trash2 } from 'lucide-react-native';

const MemberItem = ({ item, }) => {

	const handleRemoveMember = () => {
		console.log('Handling remove member', item.id)
	}
	return (
		<View className="flex-row justify-between items-center  px-4 py-3 border-b border-gray-200">
			<View className="flex-1 mr-3">
				<Text className="text-base font-bold">{item.name}</Text>
			</View>
			<TouchableOpacity
				className="p-2"
				onPress={() => handleRemoveMember(item.id)}
			>
				<Trash2 color="red" size={20} />
			</TouchableOpacity>
		</View>
	)
}

export default MemberItem