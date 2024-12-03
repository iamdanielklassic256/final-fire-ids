import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'

const AddMeetingModal = ({ isModalVisible, setModalVisible, newMeeting, setNewMeeting, handleAddMeeting, isLoading }) => {
	return (
		<Modal
			visible={isModalVisible}
			transparent={true}
			animationType="slide"
		>
			<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
				<View className="bg-white p-6 rounded-lg w-4/5">
					<Text className="text-lg font-bold mb-4">Add New Meeting</Text>
					<TextInput
						placeholder="Meeting Name"
						value={newMeeting.name}
						onChangeText={(text) =>
							setNewMeeting({ ...newMeeting, name: text })
						}
						className="border border-gray-300 p-4 rounded-lg mb-4"
					/>
					<View className="flex-row justify-between">
						<TouchableOpacity
							onPress={() => setModalVisible(false)}
							className="bg-red-500 py-2 px-4 rounded-lg"
						>
							<Text className="text-white text-center">Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleAddMeeting}
							disabled={isLoading}
							className={`bg-[#028758] py-2 px-4 rounded-lg ${isLoading ? 'opacity-50' : ''
								}`}
						>
							<Text className="text-white text-center font-bold">
								{isLoading ? 'Adding...' : 'Add'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default AddMeetingModal