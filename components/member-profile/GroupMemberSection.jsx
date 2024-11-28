import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Trash2, UserPlus } from 'lucide-react-native';
import { all_members_in_a_group } from '../../api/api';
import EnhancedLoader from '../../utils/EnhancedLoader';
import MemberItem from './renderMemberItem';

const GroupMemberSection = ({ groupId, onAddMember }) => {
	const [loading, setLoading] = useState(true);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		fetchAllGroupMembers();
	}, [groupId]);

	const fetchAllGroupMembers = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${all_members_in_a_group}/${groupId}`);
			console.log("API Response:", response.data);
			setMembers(response.data.members || []);
		} catch (error) {
			console.error("Error fetching group members details:", error);
			Alert.alert("Error", "Failed to load group members details");
		} finally {
			setLoading(false);
		}
	};

	const handleAddNewGroupMember = async () => {
		console.log('adding')
	}

	const handleRemoveMember = (memberId) => {
		Alert.alert(
			"Remove Member",
			"Are you sure you want to remove this member from the group?",
			[
				{
					text: "Cancel",
					style: "cancel"
				},
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						try {
							await axios.delete(`${remove_member_from_group}/${groupId}/${memberId}`);
							// Remove the member from local state
							setMembers(prevMembers =>
								prevMembers.filter(member => member.id !== memberId)
							);
							Alert.alert("Success", "Member removed successfully");
						} catch (error) {
							console.error("Error removing member:", error);
							Alert.alert("Error", "Failed to remove member");
						}
					}
				}
			]
		);
	};



	const renderMemberItem = ({ item }) => (
		<MemberItem item={item} />
	);

	console.log(members)



	if (loading) {
		return <EnhancedLoader isLoading={loading} message='Loading group members' />;
	}

	return (
		<View className="flex-1 ">
			<View className="flex-row justify-between items-center p-4 bg-[#111827] mx-4 mt-2 rounded-lg border-b border-gray-200">
				<Text className="text-lg font-bold text-white">Group Members ({members.length})</Text>
				<TouchableOpacity
					className="p-2"
					onPress={handleAddNewGroupMember}
				>
					<UserPlus color="green" size={24} />
				</TouchableOpacity>
			</View>

			<FlatList
				data={members}
				renderItem={renderMemberItem}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={
					<Text className="text-center mt-5 text-gray-600">No members in this group</Text>
				}
				contentContainerStyle="pb-5"
			/>
		</View>
	);
};

export default GroupMemberSection;