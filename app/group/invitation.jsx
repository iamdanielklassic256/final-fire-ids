import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { group_invitation_url, join_request_url, saving_group_members_not_in_group } from '../../api/api';

import { MaterialIcons } from '@expo/vector-icons';

const Invitations = () => {
	const [member, setMember] = useState(null);
	const [invitations, setInvitations] = useState([]);
	const [groups, setGroups] = useState([]);
	const [joinRequests, setJoinRequests] = useState([]);
	const [activeTab, setActiveTab] = useState('invitations');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [joinMessage, setJoinMessage] = useState('');
	const [isJoinRequestLoading, setIsJoinRequestLoading] = useState(false);
	const [deleteAnimation, setDeleteAnimation] = useState(new Animated.Value(1));
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [requestToDelete, setRequestToDelete] = useState(null);

	useEffect(() => {
		fetchMemberData();
	}, []);

	useEffect(() => {
		if (member?.id) {
			fetchGroupInvitations();
			fetchAllSavingGroups();
			fetchJoinRequests();
		}
	}, [member]);

	const fetchMemberData = async () => {
		try {
			const memberData = await AsyncStorage.getItem("member");
			if (memberData) {
				const memberId = JSON.parse(memberData);
				setMember(memberId);
			}
		} catch (error) {
			console.error("Error fetching member data:", error);
			setError("Failed to load member data");
		}
	};

	const fetchGroupInvitations = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${group_invitation_url}/member/${member.id}`);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data = await response.json();
			setInvitations(data?.data || []);
		} catch (error) {
			console.error('Error fetching invitations:', error);
			setError("Failed to fetch invitations");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchAllSavingGroups = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${saving_group_members_not_in_group}/${member.id}`);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data = await response.json();
			setGroups(data?.groups || []);
		} catch (error) {
			console.error('Error fetching groups:', error);
			setError("Failed to fetch groups");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchJoinRequests = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(join_request_url);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data = await response.json();
			setJoinRequests(data?.data || []);
		} catch (error) {
			console.error('Error fetching join requests:', error);
			setError("Failed to fetch join requests");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInvitation = async (invitation, status) => {
		try {
			setIsLoading(true);
			const response = await fetch(`${group_invitation_url}/${invitation.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status }),
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
			Alert.alert("Success", `Invitation ${status === 'approved' ? 'accepted' : 'declined'} successfully.`, [{ text: "OK" }]);
		} catch (error) {
			console.error('Error handling invitation:', error);
			Alert.alert("Error", `Failed to ${status}. Please try again later.`, [{ text: "OK" }]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleJoinRequest = async () => {
		if (!selectedGroup || !joinMessage.trim()) {
			Alert.alert("Error", "Please provide a message for your join request.");
			return;
		}

		try {
			setIsJoinRequestLoading(true);
			const response = await fetch(join_request_url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					groupId: selectedGroup.id,
					requested_by: member.id,
					reason_for: joinMessage.trim()
				}),
			});

			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

			Alert.alert("Success", "Join request sent successfully!", [{ text: "OK" }]);
			setModalVisible(false);
			setJoinMessage('');
			setSelectedGroup(null);
			fetchJoinRequests(); // Refresh join requests after sending a new one
		} catch (error) {
			console.error('Error sending join request:', error);
			Alert.alert("Error", "Failed to send join request. Please try again later.", [{ text: "OK" }]);
		} finally {
			setIsJoinRequestLoading(false);
		}
	};


	const handleDeleteRequest = async (request) => {
		setRequestToDelete(request);
		setShowDeleteConfirmation(true);
	};

	const confirmDeleteRequest = async () => {
		if (!requestToDelete) return;

		try {
			setIsLoading(true);
			const response = await fetch(`${join_request_url}/${requestToDelete.id}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

			// Animate the deletion
			Animated.timing(deleteAnimation, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start(() => {
				setJoinRequests(prev => prev.filter(req => req.id !== requestToDelete.id));
				setDeleteAnimation(new Animated.Value(1));
			});

			Alert.alert("Success", "Join request deleted successfully!", [{ text: "OK" }]);
		} catch (error) {
			console.error('Error deleting join request:', error);
			Alert.alert("Error", "Failed to delete join request. Please try again later.", [{ text: "OK" }]);
		} finally {
			setIsLoading(false);
			setShowDeleteConfirmation(false);
			setRequestToDelete(null);
		}
	};

	const renderInvitationItem = ({ item }) => {
		if (item.status !== 'pending') return null;
		const invitedGroup = item.group;
		return (
			<View className="bg-white rounded-lg shadow-lg m-3 p-5">
				<View className="flex-row justify-between items-center mb-4">
					<Text className="text-2xl font-bold text-purple-800">{invitedGroup.name}</Text>
					<View className="bg-yellow-100 px-2 py-1 rounded-lg">
						<Text className="text-yellow-800 text-sm">Pending</Text>
					</View>
				</View>
				<Text className="text-gray-600 mb-4 text-base">
					You've been invited to join <Text className="font-bold">{invitedGroup.name}</Text>. Do you want to accept the invitation?
				</Text>
				<View className="flex-row justify-between">
					<TouchableOpacity onPress={() => handleInvitation(item, 'approved')} className="bg-green-600 px-6 py-3 rounded-full mr-2 shadow-md">
						<Text className="text-white text-center font-semibold">Accept</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleInvitation(item, 'rejected')} className="bg-red-600 px-6 py-3 rounded-full ml-2 shadow-md">
						<Text className="text-white text-center font-semibold">Decline</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	const renderSavingGroupItem = ({ item }) => {
		const isRequestSent = joinRequests.some(request => request.groupId === item.id && request.requested_by === member.id);
		const sentRequest = joinRequests.find(request => request.groupId === item.id && request.requested_by === member.id);
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
		);
	};

	if (isLoading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#6200ee" />
				<Text className="mt-4 text-gray-600">Loading...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 justify-center items-center">
				<Text className="text-red-500">{error}</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-gray-200">
			<View className="flex flex-row justify-around items-center p-4 bg-white shadow-md">
				<TouchableOpacity onPress={() => setActiveTab('invitations')} className={`p-2 ${activeTab === 'invitations' ? 'border-b-4 border-purple-500' : ''}`}>
					<Text className={`${activeTab === 'invitations' ? 'text-purple-800' : 'text-gray-500'} text-lg font-semibold`}>
						Group Invitations
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setActiveTab('joinRequests')} className={`p-2 ${activeTab === 'joinRequests' ? 'border-b-4 border-purple-500' : ''}`}>
					<Text className={`${activeTab === 'joinRequests' ? 'text-purple-800' : 'text-gray-500'} text-lg font-semibold`}>
						Available Groups
					</Text>
				</TouchableOpacity>
			</View>

			{activeTab === 'invitations' ? (
				<>
					{invitations.length > 0 ? (
						<FlatList
							data={invitations.filter(invitation => invitation.status === 'pending')}
							renderItem={renderInvitationItem}
							keyExtractor={(item, index) => item.id?.toString() || index.toString()}
						/>
					) : (
						<View className="flex-1 justify-center items-center">
							<Text className="text-gray-500 text-lg">You have no pending invitations.</Text>
						</View>
					)}
				</>
			) : (
				<>
					{groups.length > 0 ? (
						<FlatList
							data={groups}
							renderItem={renderSavingGroupItem}
							keyExtractor={(item, index) => item.id?.toString() || index.toString()}
						/>
					) : (
						<View className="flex-1 justify-center items-center">
							<Text className="text-gray-500 text-lg">There are no available groups at the moment.</Text>
						</View>
					)}
				</>
			)}

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
		</View>
	);
};

export default Invitations;