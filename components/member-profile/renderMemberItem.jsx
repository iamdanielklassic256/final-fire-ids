import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Trash2 } from 'lucide-react-native';

const MemberItem = ({ item, onRemove, groupMembers }) => {
	console.log("member item",groupMembers)

	return (
		<View className="flex-row justify-between items-center  px-4 py-3 border-b border-gray-200">
			<View className="flex-1 mr-3">
				<Text className="text-base font-bold">{item.name}</Text>
			</View>
			
			{groupMembers.length !== 3 ? (
				<TouchableOpacity
				className="p-2"
				onPress={onRemove}
			>
				<Trash2 color="red" size={20} />
			</TouchableOpacity>
			): null}

		</View>
	)
}

export default MemberItem