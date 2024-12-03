import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Trash2 } from 'lucide-react-native'

const MemberSection = ({ item }) => {

	const handleDelete = () => {
		Alert.alert('Dummy Delete Role, Test Delete Role')
	}

	return (
		<View className="flex-row justify-between items-center  px-4 py-3 border-b border-gray-200">
			<View className="flex-1 flex-row justify-start items-center">
				<Text className="text-base font-bold">
					{item.member.fullName}
				</Text>
			</View>
			<Text className="text-sm pr-4 font-bold capitalize">{item.roleName}</Text>
			<TouchableOpacity
				className="p-2"
				onPress={handleDelete}
			>
				<Trash2 color="red" size={20} />
			</TouchableOpacity>
		</View>
	)
}

export default MemberSection