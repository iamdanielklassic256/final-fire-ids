import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Platform, RefreshControl } from 'react-native';
import axios from 'axios';
import { UserPlus, X, RefreshCw, AlertTriangle  } from 'lucide-react-native';
import {
	all_members_in_a_group,
	all_members_url,
	saving_group_members_url
} from '../../api/api';
import EnhancedLoader from '../../utils/EnhancedLoader';
import MemberItem from '../member-profile/renderMemberItem';

const GroupMemberCard = ({ groupId, groupMembers }) => {
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [members, setMembers] = useState([]);
	const [allMembers, setAllMembers] = useState([]);
	const [filteredAllMembers, setFilteredAllMembers] = useState([]);
	const [selectedMember, setSelectedMember] = useState(null);
	const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
	const [addMemberLoading, setAddMemberLoading] = useState(false);
	const [isMemberLimitModalVisible, setIsMemberLimitModalVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	// Consolidated fetch function for all data
	const fetchAllData = useCallback(async () => {
		try {
			// Fetch group members and all members concurrently
			const [groupMembersResponse, allMembersResponse] = await Promise.all([
				axios.get(`${all_members_in_a_group}/${groupId}`),
				axios.get(all_members_url)
			]);

			// Set group members
			setMembers(groupMembersResponse.data.members || []);

			// Set all members
			const all_members_data = allMembersResponse.data;
			if (all_members_data && all_members_data.data) {
				setAllMembers(all_members_data.data);
				setFilteredAllMembers(all_members_data.data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			Alert.alert("Error", "Failed to load members details");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [groupId]);

	// Initial data load
	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	// Pull to refresh handler
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchAllData();
	}, [fetchAllData]);

	const getFullMemberName = (member) => {
		const names = [member.first_name, member.last_name, member.other_name].filter(Boolean);
		return names.join(' ');
	};

	const handleMemberSelect = (member) => {
		setSelectedMember(member);
		setSearchQuery('');
	};

	useEffect(() => {
		if (searchQuery) {
			const filtered = allMembers.filter(member => {
				const fullName = getFullMemberName(member).toLowerCase();
				const query = searchQuery.toLowerCase();
				return fullName.includes(query) ||
					(member.email && member.email.toLowerCase().includes(query));
			});
			setFilteredAllMembers(filtered);
		} else {
			setFilteredAllMembers(allMembers);
		}
	}, [searchQuery, allMembers]);

	const handleAddNewGroupMember = () => {
		setIsAddMemberModalVisible(true);
		
	};

	const submitNewMember = async () => {
		if (!selectedMember) {
			Alert.alert("Selection Error", "Please select a member");
			return;
		}

		setAddMemberLoading(true);
		try {
			const response = await axios.post(`${saving_group_members_url}`, {
				groupId,
				memberId: selectedMember.id,
			});

			if (response.data.member) {
				// Refresh all data after successfully adding a member
				await fetchAllData();
				setSelectedMember(null);
				setIsAddMemberModalVisible(false);
				Alert.alert("Success", "Member added successfully");
			}
		} catch (error) {
			console.error("Error adding member:", error);
			Alert.alert("Error", error.response?.data?.message || "Failed to add member");
		} finally {
			setAddMemberLoading(false);
		}
	};

	const handleRemoveMember = async (groupMemberId) => {
		Alert.alert(
			"Remove Member",
			"Are you sure you want to remove this member from the group?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						try {
							await axios.delete(`${saving_group_members_url}/${groupMemberId}`);
							// Refresh data after removing member
							await fetchAllData();
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

	const renderAllMemberItem = ({ item }) => (
		<TouchableOpacity
			style={[
				styles.memberItem,
				selectedMember?.id === item.id && { backgroundColor: '#E0E0E0' }
			]}
			onPress={() => handleMemberSelect(item)}
		>
			<View className="flex-row justify-between items-center">
				<Text style={styles.memberName}>{getFullMemberName(item)}</Text>
				{selectedMember?.id === item.id && (
					<Text style={styles.selectedIndicator}>✓</Text>
				)}
			</View>
		</TouchableOpacity>
	);

	if (loading) {
		return <EnhancedLoader isLoading={loading} message='Loading group members' />;
	}

	return (
		<View className="flex-1">
			<View className="flex-row justify-between items-center p-4 bg-[#111827] mx-4 mt-2 rounded-lg border-b border-gray-200">
				<Text className="text-lg font-bold text-white">Group Members ({members.length})</Text>

				<View className="flex-row items-center">
					<TouchableOpacity
						className="p-2 mr-2"
						onPress={onRefresh}
					>
						<RefreshCw color="white" size={24} />
					</TouchableOpacity>

				
						<TouchableOpacity
							className="p-2"
							onPress={handleAddNewGroupMember}
						>
							<UserPlus color="green" size={24} />
						</TouchableOpacity>
				
				</View>
			</View>

			<FlatList
				data={members}
				renderItem={({ item }) => (
					<MemberItem
						item={item}
						groupMembers={groupMembers}
						onRemove={() => handleRemoveMember(item.groupMemberId)}
					/>
				)}
				keyExtractor={(item) => item.id.toString()}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={['#9Bd35A', '#689F38']}
					/>
				}
				ListEmptyComponent={
					<Text className="text-center mt-5 text-gray-600">No members in this group</Text>
				}
				contentContainerStyle="pb-5"
			/>

			<Modal
				visible={isMemberLimitModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setIsMemberLimitModalVisible(false)}
			>
				<View className="flex-1 justify-center items-center bg-black/50">
					<View className="bg-white rounded-lg p-6 w-[85%]">
						<View className="flex-row items-center justify-center mb-4">
							<AlertTriangle color="red" size={32} />
						</View>
						<Text className="text-center text-xl font-bold mb-4 text-red-600">
							Member Limit Reached
						</Text>
						<Text className="text-center text-base mb-6">
							You can only add up to 3 members to this group.
							Please you need to login as a group to add or remove more members.
						</Text>
						<TouchableOpacity
							className="bg-[#028758] rounded-lg p-3"
							onPress={() => setIsMemberLimitModalVisible(false)}
						>
							<Text className="text-white text-center text-base">
								Understood
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<Modal
				visible={isAddMemberModalVisible}
				transparent={false}
				animationType="slide"
				onRequestClose={() => setIsAddMemberModalVisible(false)}
			>
				<View className="flex-1 bg-white">
					<View className="flex-row justify-between items-center p-4 bg-[#111827]">
						<Text className="text-lg font-bold text-white">Add New Member</Text>
						<TouchableOpacity onPress={() => setIsAddMemberModalVisible(false)}>
							<X color="red" size={24} />
						</TouchableOpacity>
					</View>

					<View style={styles.searchContainer}>
						<TextInput
							style={styles.searchInput}
							placeholder="Search members..."
							value={searchQuery}
							onChangeText={setSearchQuery}
							autoFocus={true}
						/>
					</View>

					<FlatList
						data={filteredAllMembers}
						renderItem={renderAllMemberItem}
						keyExtractor={(item) => item.id.toString()}
						ListEmptyComponent={
							<Text style={styles.noResultsText}>No members found</Text>
						}
					/>
					<TouchableOpacity
						className={`rounded-lg p-3 bg-[#028758] m-4`}
						onPress={submitNewMember}
						disabled={!selectedMember || addMemberLoading}
					>
						{addMemberLoading ? (
							<Text className="text-white text-center">Adding...</Text>
						) : (
							<Text className="text-white text-center">Add Member</Text>
						)}
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	);
};

export default GroupMemberCard;



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F0F4F8',
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 40,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#028758',
		textAlign: 'center',
		marginVertical: 20,
	},
	inputContainer: {
		backgroundColor: 'white',
		borderRadius: 12,
		marginBottom: 15,
		padding: 15,
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	label: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#4a008f',
		marginBottom: 5,
	},
	pickerContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		marginTop: 5,
	},
	picker: {
		height: 50,
		color: '#333',
	},
	roleDescription: {
		fontSize: 12,
		color: '#666',
		marginTop: 8,
		fontStyle: 'italic',
		paddingHorizontal: 4,
	},
	button: {
		backgroundColor: '#028758',
		paddingVertical: 15,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 20,
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	buttonDisabled: {
		backgroundColor: '#92B5A8',
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 16,
		textAlign: 'center',
	},
	noDataText: {
		color: '#666',
		fontSize: 16,
		textAlign: 'center',
		marginVertical: 10,
		fontStyle: 'italic',
	},
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: '80%',
		paddingBottom: Platform.OS === 'ios' ? 40 : 20,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#028758',
	},
	closeButton: {
		padding: 5,
	},
	closeButtonText: {
		fontSize: 20,
		color: '#666',
	},
	searchContainer: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
	},
	searchInput: {
		backgroundColor: '#F0F4F8',
		padding: 12,
		borderRadius: 10,
		fontSize: 16,
	},
	memberItem: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
	},
	memberName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	memberDetail: {
		fontSize: 14,
		color: '#666',
		marginTop: 4,
	},
	noResultsText: {
		textAlign: 'center',
		padding: 20,
		color: '#666',
		fontStyle: 'italic',
	},
	memberSelector: {
		backgroundColor: '#F0F4F8',
		padding: 15,
		borderRadius: 10,
		marginTop: 5,
	},
	memberSelectorPlaceholder: {
		color: '#666',
		fontSize: 16,
	},
	selectedMemberText: {
		color: '#333',
		fontSize: 16,
		fontWeight: '500',
	},
	selectedIndicator: {
		color: '#028758',
		fontWeight: 'bold',
		marginTop: 5,
	},
});