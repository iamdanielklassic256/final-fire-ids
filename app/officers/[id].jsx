import React, { useEffect, useState, useCallback } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Modal,
	FlatList,
	Alert,
	RefreshControl
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import { all_members_in_a_group, role_url, roles_by_group_url } from '../../api/api';
import EnhancedLoader from '../../utils/EnhancedLoader';
import AkibaHeader from '../../components/AkibaHeader';
import { StatusBar } from 'expo-status-bar';
import { UserPlus, X, RefreshCw } from 'lucide-react-native';
import MemberSection from '../../components/member-profile/MemberSection';

const ElectOfficerScreen = () => {
	const { id } = useLocalSearchParams();
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [members, setMembers] = useState([]);
	const [selectedMember, setSelectedMember] = useState(null);
	const [roleName, setRoleName] = useState("");
	const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
	const [isAddNewRole, setIsAddNewRole] = useState(false);
	const [roles, setRoles] = useState([]);

	// Consolidated fetch function to load group members and roles
	const fetchGroupData = useCallback(async () => {
		try {
			// Use Promise.all to fetch members and roles concurrently
			const [membersResponse, rolesResponse] = await Promise.all([
				axios.get(`${all_members_in_a_group}/${id}`),
				axios.get(`${roles_by_group_url}/${id}`)
			]);

			setMembers(membersResponse.data.members || []);
			setRoles(rolesResponse.data || []);
		} catch (error) {
			console.error("Error fetching group data:", error);
			Alert.alert("Error", "Failed to load group details");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [id]);

	// Initial data load
	useEffect(() => {
		fetchGroupData();
	}, [fetchGroupData]);

	// Pull to refresh handler
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchGroupData();
	}, [fetchGroupData]);

	const handleMemberSelect = (member) => {
		setSelectedMember(member);
		setIsMemberModalVisible(false);
	};

	const handleAddNewGroupMemberRole = () => {
		setIsAddNewRole(true);
	};

	const handleSubmitOfficer = async () => {
		// Validate inputs
		if (!roleName.trim()) {
			Alert.alert("Validation Error", "Please enter a role name");
			return;
		}

		if (!selectedMember) {
			Alert.alert("Validation Error", "Please select a member");
			return;
		}
		setLoading(true);

		try {
			const response = await axios.post(role_url, {
				groupId: id,
				name: roleName.trim(),
				memberId: selectedMember.id
			});

			if (response.status === 201) {
				Alert.alert("Success", "Officer elected successfully!");
				// Reset form and reload data
				setRoleName("");
				setSelectedMember(null);
				setIsAddNewRole(false);
				await fetchGroupData(); // Reload data after successful role assignment
			}
		} catch (error) {
			console.error("Error electing officer:", error);
			Alert.alert("Error", "Failed to elect officer");
			setLoading(false);
		}
	};

	const MemberModal = () => (
		<Modal
			animationType="slide"
			transparent={false}
			visible={isMemberModalVisible}
			onRequestClose={() => setIsMemberModalVisible(false)}
		>
			<View className="flex-1 justify-center items-center bg-black/50">
				<View className="w-4/5 bg-white rounded-xl p-5 ">
					<Text className="text-lg font-bold mb-4 text-center">Select a Member</Text>
					<FlatList
						data={members}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity
								className="p-4 border-b border-gray-200"
								onPress={() => handleMemberSelect(item)}
							>
								<Text>{item.name}</Text>
							</TouchableOpacity>
						)}
					/>
					<TouchableOpacity
						className="mt-4 p-3 bg-gray-100 rounded-lg items-center"
						onPress={() => setIsMemberModalVisible(false)}
					>
						<Text className="font-bold text-gray-700">Close</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);

	if (loading) {
		return <EnhancedLoader isLoading={loading} message='Loading group members officers' />;
	}

	return (
		<View className="flex-1 bg-gray-300">
			<AkibaHeader
				title="Elect Group Officer"
				message="Assign role to a member"
				icon="arrow-back"
				color="white"
				handlePress={() => router.back()}
			/>

			<View className="flex-row justify-between items-center p-4 bg-[#111827] mx-4 mt-2 rounded-lg border-b border-gray-200">
				<Text className="text-lg font-bold text-white">Group Member Officers</Text>
				<View className="flex-row items-center">
					<TouchableOpacity
						className="p-2 mr-2"
						onPress={onRefresh}
					>
						<RefreshCw color="white" size={24} />
					</TouchableOpacity>
					<TouchableOpacity
						className="p-2"
						onPress={handleAddNewGroupMemberRole}
					>
						<UserPlus color="green" size={24} />
					</TouchableOpacity>
				</View>
			</View>

			<FlatList
				data={roles}
				renderItem={({ item }) => (
					<MemberSection
						item={item}
					/>
				)}
				keyExtractor={(item) => item.roleId.toString()}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={['#9Bd35A', '#689F38']}
					/>
				}
				ListEmptyComponent={
					<Text className="text-center mt-5 text-gray-600">No member assigned to a role in this group</Text>
				}
				contentContainerStyle="pb-5"
			/>

			<Modal
				visible={isAddNewRole}
				transparent={false}
				animationType="slide"
				onRequestClose={() => setIsAddNewRole(false)}
			>
				<View className="flex-1 bg-white p-4">
					<View className="flex-row justify-between items-center p-4 bg-[#111827] mb-10 rounded-lg border-b border-gray-200">
						<Text className="text-lg font-bold text-white">Add New Member</Text>
						<TouchableOpacity onPress={() => setIsAddNewRole(false)}>
							<X color="red" size={24} />
						</TouchableOpacity>
					</View>
					<TextInput
						className="border border-gray-300 p-3 mb-4 rounded-lg bg-white"
						placeholder="Enter Role Name (Chairperson, Secretary, Book keeper etc.)"
						value={roleName}
						onChangeText={setRoleName}
					/>

					<TouchableOpacity
						className="bg-gray-200 p-4 rounded-lg items-center mb-4"
						onPress={() => setIsMemberModalVisible(true)}
					>
						<Text className="text-gray-700 font-bold">
							{selectedMember
								? `Selected: ${selectedMember.name}`
								: "Select a Member"}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="bg-blue-500 p-4 rounded-lg items-center"
						onPress={handleSubmitOfficer}
					>
						<Text className="text-white font-bold">Elect Officer</Text>
					</TouchableOpacity>

					<MemberModal />
				</View>
			</Modal>
		</View>
	)
}

export default ElectOfficerScreen;