import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { group_invitation_url, join_request_url, saving_group_members_not_in_group } from '../../api/api';
import EnhancedLoader from '../../utils/EnhancedLoader'
import AkibaHeader from '../../components/AkibaHeader';
import InvitationTab from '../../components/personal-account/InvitationTab';
import InvitationItem from '../../components/personal-account/InvitationItem';
import SavingGroupItem from '../../components/personal-account/SavingGroupItem';
import JoinRequestModal from '../../components/personal-account/JoinRequestModal';
import DeleteRequestModal from '../../components/personal-account/DeleteRequestModal';

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
			<InvitationItem
				handleInvitation={handleInvitation}
				invitedGroup={invitedGroup}
				item={item}

			/>
		);
	};

	const renderSavingGroupItem = ({ item }) => {
		const isRequestSent = joinRequests.some(request => request.groupId === item.id && request.requested_by === member.id);
		const sentRequest = joinRequests.find(request => request.groupId === item.id && request.requested_by === member.id);
		return (
			<SavingGroupItem
				deleteAnimation={deleteAnimation}
				handleDeleteRequest={handleDeleteRequest}
				item={item}
				isRequestSent={isRequestSent}
				sentRequest={sentRequest}
				setModalVisible={setModalVisible}
				setSelectedGroup={setSelectedGroup}

			/>
		);
	};

	if (isLoading) {
		return (
			<EnhancedLoader
				isLoading={true}
				message='Loading all saving groups...'
			/>
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
		<View className="flex-1 bg-gray-200 text-white">
			<AkibaHeader
				title="Saving Groups"
				message="Find your saving groups"
			/>
			<InvitationTab
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>

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

			<JoinRequestModal
				handleJoinRequest={handleJoinRequest}
				isJoinRequestLoading={isJoinRequestLoading}
				joinMessage={joinMessage}
				modalVisible={modalVisible}
				selectedGroup={selectedGroup}
				setJoinMessage={setJoinMessage}
				setModalVisible={setModalVisible}
				setSelectedGroup={setSelectedGroup}
			/>

			<DeleteRequestModal
				confirmDeleteRequest={confirmDeleteRequest}
				requestToDelete={requestToDelete}
				setShowDeleteConfirmation={setShowDeleteConfirmation}
				showDeleteConfirmation={showDeleteConfirmation}
			/>
		</View>
	);
};

export default Invitations;