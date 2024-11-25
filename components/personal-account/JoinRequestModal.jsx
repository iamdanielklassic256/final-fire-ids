import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

const JoinRequestModal = ({modalVisible, setModalVisible, selectedGroup, setSelectedGroup, joinMessage, setJoinMessage, handleJoinRequest, isJoinRequestLoading }) => {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(!modalVisible);
			}}
		>
			<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
				<View className="bg-white p-6 rounded-lg w-5/6">
					<Text className="text-xl font-bold mb-4">Join {selectedGroup?.name}</Text>
					<TextInput
						className="border border-gray-300 p-2 rounded-md mb-4"
						onChangeText={setJoinMessage}
						value={joinMessage}
						placeholder="Enter a message for your join request"
						multiline
					/>
					<View className="flex-row justify-between">
						<TouchableOpacity
							onPress={() => {
								setModalVisible(!modalVisible);
								setJoinMessage('');
								setSelectedGroup(null);
							}}
							className="bg-gray-500 px-6 py-3 rounded-full mr-2"
						>
							<Text className="text-white text-center font-semibold">Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleJoinRequest}
							className="bg-purple-600 px-6 py-3 rounded-full ml-2"
							disabled={isJoinRequestLoading}
						>
							{isJoinRequestLoading ? (
								<ActivityIndicator size="small" color="#ffffff" />
							) : (
								<Text className="text-white text-center font-semibold">Send Request</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default JoinRequestModal