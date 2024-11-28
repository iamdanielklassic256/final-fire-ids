import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Trash2 } from 'lucide-react-native';

const MemberItem = ({ item, onRemove }) => {

	// const handleRemoveMember = () => {
	// 	console.log('Handling remove member', item.id)
	// 	console.log("haa",item.memberId)

	// 	Alert.alert(
	// 		"Remove Member",
	// 		"Are you sure you want to remove this member from the group?",
	// 		[
	// 			{ text: "Cancel", style: "cancel" },
	// 			{
	// 				text: "Remove",
	// 				style: "destructive",
	// 				onPress: async () => {
	// 					try {
	// 						await axios.delete(`${saving_group_members_url}/${item.id}`);
	// 						Alert.alert("Success", "Member removed successfully");
	// 					} catch (error) {
	// 						console.error("Error removing member:", error);
	// 						Alert.alert("Error", "Failed to remove member");
	// 					}
	// 				}
	// 			}
	// 		]
	// 	);
	// }
	return (
		<View className="flex-row justify-between items-center  px-4 py-3 border-b border-gray-200">
			<View className="flex-1 mr-3">
				<Text className="text-base font-bold">{item.name}</Text>
				{/* <Text>{item.id}</Text> */}
			</View>
			<TouchableOpacity
				className="p-2"
				onPress={onRemove}
			>
				<Trash2 color="red" size={20} />
			</TouchableOpacity>
		</View>
	)
}

export default MemberItem