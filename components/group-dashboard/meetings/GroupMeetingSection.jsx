import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import axios from 'axios';
import AddMeetingModal from '../../meetings/AddMeetingModal';
import MeetingItem from '../../meetings/MeetingItem';
import { group_meeting_url } from '../../../api/api';
import { Feather } from '@expo/vector-icons';
import EnhancedLoader from '../../../utils/EnhancedLoader';

const GroupMeetingSection = ({ groupId }) => {
	const [meetings, setMeetings] = useState([]);
	const [isModalVisible, setModalVisible] = useState(false);
	const [newMeeting, setNewMeeting] = useState({ name: '' });
	const [isLoading, setIsLoading] = useState(false);

	// Fetch meetings when the component mounts
	useEffect(() => {
		fetchMeetings();
	}, [groupId]);

	const fetchMeetings = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				`${group_meeting_url}/group/${groupId}`
			);
			setMeetings(response.data);
			setIsLoading(false);
		} catch (error) {
			console.error('Error fetching meetings:', error.message);
			Alert.alert('Error', 'Failed to fetch meetings');
			setIsLoading(false);
		}
	};

	const handleAddMeeting = async () => {
		if (!newMeeting.name.trim()) {
			Alert.alert('Invalid Input', 'Please enter a meeting name');
			return;
		}

		setIsLoading(true);
		try {
			const response = await axios.post(
				group_meeting_url,
				{
					groupId,
					name: newMeeting.name,
				}
			);
			setMeetings(response.data);
			setModalVisible(false);
			setNewMeeting({ name: '' });
		} catch (error) {
			console.error('Error adding meeting:', error.message);
			Alert.alert('Error', 'Failed to add meeting');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteMeeting = async (meetingId) => {
		setIsLoading(true);
		try {
			const response = await axios.delete(`${group_meeting_url}/${meetingId}`);
			setMeetings(response.data);
			Alert.alert('Success', 'Meeting deleted successfully');
		} catch (error) {
			console.error('Error deleting meeting:', error.message);
			Alert.alert('Error', 'Failed to delete meeting');
			setIsLoading(false);
		}
	};

	const renderMeetingItem = ({ item }) => (
		<MeetingItem 
			item={item} 
			onDelete={() => {
				Alert.alert(
					'Confirm Deletion',
					'Are you sure you want to delete this meeting?',
					[
						{ 
							text: 'Cancel', 
							style: 'cancel' 
						},
						{ 
							text: 'Delete', 
							style: 'destructive', 
							onPress: () => handleDeleteMeeting(item.id) 
						}
					]
				);
			}}
		/>
	);

	if (isLoading ) {
		return (
		  <EnhancedLoader isLoading={isLoading} message='Loading group meetings' />
		);
	  }

	return (
		<View className="p-4">
			<TouchableOpacity
				onPress={() => setModalVisible(true)}
				className="bg-[#028758] py-4 px-4 rounded-lg mb-4 flex-row justify-center items-center"
			>
				<Feather name="plus" size={20} color="white" />
				<Text className="text-white text-center font-bold ml-2">Add Meeting</Text>
			</TouchableOpacity>
			<FlatList
				data={meetings}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderMeetingItem}
				ListEmptyComponent={
					<View className="flex-1 items-center justify-center mt-4">
						<Feather name="calendar" size={50} color="#A0AEC0" />
						<Text className="text-center text-gray-500 mt-2">
							No meetings scheduled
						</Text>
					</View>
				}
			/>
			<AddMeetingModal
				handleAddMeeting={handleAddMeeting}
				isLoading={isLoading}
				isModalVisible={isModalVisible}
				setModalVisible={setModalVisible}
				newMeeting={newMeeting}
				setNewMeeting={setNewMeeting}
			/>
		</View>
	);
};

export default GroupMeetingSection;