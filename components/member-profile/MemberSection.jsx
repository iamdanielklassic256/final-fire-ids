import { View, Text } from 'react-native'
import React from 'react'

const MemberSection = ({item}) => {
	return (
		<View className="flex-row justify-between  px-4 py-3 border-b border-gray-200">
			<View className="flex-1 flex-row justify-start items-center">
				<Text className="text-base font-bold">
					{item.member.fullName} 
				</Text>
			</View>
				<Text className="text-sm pr-4 font-bold capitalize">{item.roleName}</Text>
			
		</View>
	)
}

export default MemberSection