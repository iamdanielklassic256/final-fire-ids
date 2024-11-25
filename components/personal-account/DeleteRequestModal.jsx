import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const DeleteRequestModal = ({showDeleteConfirmation, setShowDeleteConfirmation, requestToDelete, confirmDeleteRequest}) => {
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={showDeleteConfirmation}
			onRequestClose={() => setShowDeleteConfirmation(false)}
		>
			<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
				<View className="bg-white p-6 rounded-lg w-5/6">
					<View className="flex-row items-center mb-4">
						<MaterialIcons name="warning" size={24} color="red" />
						<Text className="text-xl font-bold ml-2">Confirm Deletion</Text>
					</View>
					<Text className="text-gray-700 mb-4">
						Are you sure you want to delete your join request for {requestToDelete?.group?.name}? This action cannot be undone.
					</Text>
					<View className="flex-row justify-end">
						<TouchableOpacity
							onPress={() => setShowDeleteConfirmation(false)}
							className="bg-gray-500 px-4 py-2 rounded-full mr-2"
						>
							<Text className="text-white font-semibold">Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={confirmDeleteRequest}
							className="bg-red-500 px-4 py-2 rounded-full"
						>
							<Text className="text-white font-semibold">Delete</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default DeleteRequestModal