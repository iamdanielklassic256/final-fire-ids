import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { all_members_url, group_invitation_url } from '../../api/api';
import Loader from '../Loader';
import GroupMembersSection from './members';
import InviteMemberModal from './InviteMemberModal';

const GroupInvitation = ({ groupId }) => {
	const [member, setMember] = useState(null);
	const [allMembers, setAllMembers] = useState([]);
	const [invitations, setInvitations] = useState([]); // State for group invitations
	const [isInviteModalVisible, setInviteModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedMemberId, setSelectedMemberId] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('members'); // Tab state: 'members' or 'invitations'


	const openInviteModal = () => setInviteModalVisible(true);
	const closeInviteModal = () => setInviteModalVisible(false);

	useEffect(() => {
		const fetchMemberData = async () => {
			try {
				const memberData = await AsyncStorage.getItem("member");
				if (memberData) {
					const memberId = JSON.parse(memberData);
					setMember(memberId);
				}
			} catch (error) {
				console.error("Error fetching member data:", error);
			}
		};

		fetchMemberData();
		fetchAllMembers();
		fetchGroupInvitations(); // Fetch invitations on component load
	}, [groupId]);

	const fetchAllMembers = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(all_members_url);
			if (response.status === 200) {
				const data = await response.json();
				const validMembers = data.data.map(member => ({
					...member,
					formattedName: formatMemberName(member)
				}));
				setAllMembers(validMembers);
			}
		} catch (error) {
			console.error('Error fetching members:', error);
			Alert.alert("Error", "Failed to fetch members. Please try again later.", [{ text: "OK" }]);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchGroupInvitations = async () => {
		console.log('group Id', groupId)
		try {
			setIsLoading(true);
			const response = await fetch(`${group_invitation_url}/group/${groupId}`);
			if (response.status === 200) {
				const data = await response.json();
				setInvitations(data?.data); // Assuming the response has 'invitations' key
			}
		} catch (error) {
			console.error('Error fetching invitations:', error);
			Alert.alert("Error", "Failed to fetch invitations. Please try again later.", [{ text: "OK" }]);
		} finally {
			setIsLoading(false);
		}
	};

	console.log(invitations)

	const formatMemberName = (member) => {
		const names = [member.first_name, member.last_name, member.other_name].filter(Boolean);
		return names.join(' ');
	};

	const validateData = () => {
		if (!groupId) {
			Alert.alert("Error", "Group ID is missing.");
			return false;
		}

		if (!member?.id) {
			Alert.alert("Error", "Your member information is missing.");
			return false;
		}

		if (!selectedMemberId) {
			Alert.alert("Error", "Please select a member to invite.");
			return false;
		}

		return true;
	};

	const handleInvitation = async () => {
		if (!validateData()) return;

		try {
			setIsLoading(true);
			const invitationData = {
				groupId: groupId,
				invited_by: member.id,
				status: "pending",
				invited_member_id: selectedMemberId
			};

			const response = await fetch(group_invitation_url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invitationData),
			});

			if (!response.ok) throw new Error('Failed to create group invitation');

			Alert.alert("Success", "Invitation sent successfully!");
			resetForm();
			
		} catch (error) {
			console.error("Error sending invitation:", error);
			let errorMessage = "Failed to send invitation. Please try again.";
			if (error.response) {
				errorMessage = error.response.data.message || errorMessage;
			}
			Alert.alert("Error", errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setSelectedMemberId(null);
		setSearchQuery('');
		closeInviteModal();
	};

	const filteredMembers = allMembers.filter(member => {
		const searchName = member.formattedName.toLowerCase();
		const query = searchQuery.toLowerCase();
		return searchName.includes(query);
	});

	const renderMemberList = () => (
		<GroupMembersSection groupId={groupId} />
	);

	const formatInvitedMemberName = (member) => {
		const names = [member?.first_name, member?.last_name, member?.other_name].filter(Boolean);
		return names.join(' ');
	};

	const renderInvitationsList = () => {
		const pendingInvitations = invitations.filter(invitation => invitation.status === 'pending' || 'rejected');
		return (
			<FlatList
				data={pendingInvitations}
				renderItem={({ item }) => {
					const invitedMember = item.invitedMember;
					const formattedName = formatInvitedMemberName(invitedMember);

					return (
						<View className="flex flex-row justify-between p-4 border-b border-gray-200">
							<Text className="text-lg font-medium">{formattedName}</Text>
							<Text className="text-sm text-yellow-500">{item.status}</Text>
						</View>
					);
				}}
				keyExtractor={(item, index) => item.id?.toString() || index.toString()}
				ListEmptyComponent={() => (
					<Text className="text-center p-4 text-gray-500">
						{pendingInvitations.length === 0 ? 'No pending invitations found' : ''}
					</Text>
				)}
			/>
		);
	};


	return (
		<View className="flex-1 bg-gray-100">
			<View>
				<TouchableOpacity onPress={openInviteModal} className="p-4 bg-purple-500 rounded-md">
					<Text className="text-center text-white font-bold">Invite Members</Text>
				</TouchableOpacity>
			</View>

			<View className="flex flex-row justify-around items-center p-4 bg-white rounded-t-md shadow-md">
				<TouchableOpacity
					onPress={() => setActiveTab('members')}
					className={`p-2 ${activeTab === 'members' ? 'border-b-4 border-purple-500' : ''}`}
				>
					<Text className={`${activeTab === 'members' ? 'text-purple-800' : 'text-gray-500'} text-lg font-semibold`}>
						Group Members
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => setActiveTab('invitations')}
					className={`p-2 ${activeTab === 'invitations' ? 'border-b-4 border-purple-500' : ''}`}
				>
					<Text className={`${activeTab === 'invitations' ? 'text-purple-800' : 'text-gray-500'} text-lg font-semibold`}>
						Invitations
					</Text>
				</TouchableOpacity>
			</View>

			{activeTab === 'members' && (
				<View className="flex-1 p-4">
					{isLoading ? <Loader /> : renderMemberList()}
				</View>
			)}

			{activeTab === 'invitations' && (
				<View className="flex-1 p-4">
					{isLoading ? <Loader /> : renderInvitationsList()}
				</View>
			)}
			<InviteMemberModal
				visible={isInviteModalVisible}
				onClose={closeInviteModal}
				allMembers={allMembers}
				selectedMemberId={selectedMemberId}
				setSelectedMemberId={setSelectedMemberId}
				handleInvitation={handleInvitation}
				isLoading={isLoading}
				resetForm={resetForm}
			/>
		</View>
	);
};

export default GroupInvitation;
