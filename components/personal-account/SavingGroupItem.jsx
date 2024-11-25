import { View, Text, Animated } from 'react-native'
import React from 'react'

const SavingGroupItem = ({deleteAnimation, item, isRequestSent, setSelectedGroup, setModalVisible, sentRequest, handleDeleteRequest }) => {
	return (
		<Animated.View style={{ opacity: deleteAnimation }} className="bg-white rounded-lg shadow-lg m-4 p-5">
			<View className="flex-row justify-between items-center mb-2">
				<Text className="text-xl font-bold text-purple-800">{item.name}</Text>
				<Text className="text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</Text>
			</View>
			<View className="flex-row justify-between items-center mb-4">
				<Text className="text-gray-500 text-sm">
					Share Value: UGX<Text className="font-semibold">{item.share_value} </Text>
				</Text>
				<Text className="text-gray-500 text-sm">
					Members: <Text className="font-semibold">{item.membersCount || 0}</Text>
				</Text>
			</View>
			<View className="flex-row justify-between items-center">
				<TouchableOpacity
					onPress={() => {
						if (!isRequestSent) {
							setSelectedGroup(item);
							setModalVisible(true);
						}
					}}
					className={`${isRequestSent ? 'bg-orange-500' : 'bg-purple-600'} px-6 py-3 rounded-full shadow-md flex-1 mr-2`}
					disabled={isRequestSent}
				>
					<Text className="text-white text-center font-semibold">
						{isRequestSent ? 'Request Pending' : 'Join Group'}
					</Text>
				</TouchableOpacity>
				{isRequestSent && (
					<TouchableOpacity
						onPress={() => handleDeleteRequest(sentRequest)}
						className="bg-red-500 p-3 rounded-full shadow-md"
					>
						<MaterialIcons name="delete" size={24} color="white" />
					</TouchableOpacity>
				)}
			</View>
		</Animated.View>
	)
}

export default SavingGroupItem