import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { all_members_in_a_group, group_meeting_url, saving_group_url } from '../../api/api'; // Adjust the import path as needed
import CreateMeetingModal from '../../components/savings/CreateMeetingModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const SingleMeetingScreen = () => {
	const { id, groupName } = useLocalSearchParams();
	const [members, setMembers] = useState([]);
	const [meetings, setMeetings] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentMember, setCurrentMember] = useState("");
	const [group, setGroup] = useState(null);
	const [editingMeeting, setEditingMeeting] = useState(null);

	const navigation = useNavigation();

	useEffect(() => {
		const fetchMemberData = async () => {
			try {
				const memberData = await AsyncStorage.getItem("member");
				if (memberData) {
					const member = JSON.parse(memberData);
					setCurrentMember(member);
				}
			} catch (error) {
				console.error("Error fetching member data:", error);
			}
		};

		fetchMemberData();
		fetchGroupDetails();
	}, [id]);

	const fetchGroupDetails = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${saving_group_url}/${id}`);
			if (response.ok) {
				const data = await response.json();
				setGroup(data);
				navigation.setOptions({ headerTitle: data.name });
			} else {
				setError('Failed to fetch group details');
			}
		} catch (error) {
			console.error('Error fetching group details:', error);
			setError('An error occurred while fetching group details');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchMeetings();
		fetchMembers();
	}, []);

	const fetchMembers = async () => {
		try {
			const response = await fetch(`${all_members_in_a_group}/${id}`);
			if (response.ok) {
				const data = await response.json();
				setMembers(Array.isArray(data.members) ? data.members : []);
			} else {
				console.error('Failed to fetch members');
			}
		} catch (error) {
			console.error('Error fetching members:', error);
		}
	};

	const fetchMeetings = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${group_meeting_url}/group/${id}`);
			if (response.ok) {
				const data = await response.json();
				setMeetings(Array.isArray(data) ? data : []);
			} else {
				setError('Failed to fetch group meetings');
			}
		} catch (error) {
			setError('Error fetching meetings');
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateMeeting = async (formData) => {
		try {
			const response = await fetch(group_meeting_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					scheduled_date: formData.scheduled_date.toISOString(),
					start_time: formData.start_time.toISOString(),
					end_time: formData.end_time.toISOString(),
				}),
			});

			if (response.ok) {
				fetchMeetings();
				setIsModalVisible(false);
				Alert.alert('Meeting Created')
			} else {
				console.error('Failed to create meeting');
			}
		} catch (error) {
			console.error('Error creating meeting:', error);
		}
	};


	const handleEditMeeting = async (formData) => {
		console.log("########################################################################")
		console.log(formData)
		try {
			const response = await fetch(`${group_meeting_url}/${editingMeeting.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					scheduled_date: formData.scheduled_date.toISOString(),
					start_time: formData.start_time.toISOString(),
					end_time: formData.end_time.toISOString(),
				}),
			});

			if (response.ok) {
				fetchMeetings();
				setIsModalVisible(false);
				setEditingMeeting(null);
				Alert.alert('Meeting Updated');
			} else {
				console.error('Failed to update meeting');
			}
		} catch (error) {
			console.error('Error updating meeting:', error);
		}
	};

	const handleDeleteMeeting = async (meetingId) => {
		Alert.alert(
			"Delete Meeting",
			"Are you sure you want to delete this meeting?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							const response = await fetch(`${group_meeting_url}/${meetingId}`, {
								method: 'DELETE',
							});

							if (response.ok) {
								fetchMeetings();
								Alert.alert('Meeting Deleted');
							} else {
								console.error('Failed to delete meeting');
							}
						} catch (error) {
							console.error('Error deleting meeting:', error);
						}
					}
				}
			]
		);
	};

	const getMemberNameById = (memberId) => {
		const member = members.find(m => m.id === memberId);
		return member ? member.name : 'Unknown Member';
	};

	const navigateToMeetingDetails = (meeting) => {
		console.log('@@@@@@@@@@')
		console.log("Getting Single meeting: ", meeting.id)
		router.push({
		  pathname: 'meetings/meeting/[id]',
		  params: { id: meeting.id, meeting: meeting.name }
		});
	  };



	const renderMeetingItem = ({ item }) => {
		
		const formatTime = (dateString) => {
			return new Date(dateString).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit'
			});
		};


		return (
			<TouchableOpacity 
				
			onPress={() => navigateToMeetingDetails(item)} 
			>
				<Card style={styles.meetingCard} className="bg-[#192f6a]">
					<Card.Content>
						<View style={styles.dateContainer}>
							<MaterialIcons name="event" size={24} color="#4CAF50" />
							<Text style={styles.dateText}>
								{new Date(item.scheduled_date).toLocaleDateString()}
							</Text>
						</View>

						<View style={styles.timeContainer}>
							<View style={styles.timeItem}>
								<MaterialIcons name="schedule" size={20} color="#ffffff" />
								<Text style={styles.timeLabel}>Start:</Text>
								<Text style={styles.timeText}>{formatTime(item.start_time)}</Text>
							</View>
							<View style={styles.timeItem}>
								<MaterialIcons name="timer-off" size={20} color="#ffffff" />
								<Text style={styles.timeLabel}>End:</Text>
								<Text style={styles.timeText}>{formatTime(item.end_time)}</Text>
							</View>
						</View>

						<View style={styles.agendaContainer}>
							<Text style={styles.agendaTitle}>Agenda:</Text>
							<Text style={styles.agendaText}>{item.agenda}</Text>
						</View>

						<View style={styles.chairContainer}>
							<MaterialIcons name="person" size={24} color="#4CAF50" />
							<Text style={styles.chairText}>
								Chaired by: {getMemberNameById(item.chaired_by)}
							</Text>
						</View>

						{currentMember?.id === group?.created_by && (
							<View style={styles.actionButtons} >
								<Button
									icon="pencil"
									mode="outlined"
									onPress={() => {
										setEditingMeeting(item);
										setIsModalVisible(true);
									}}
									className="bg-green-600 text-white"
								>
									Edit
								</Button>
								<Button
									icon="delete"
									mode="outlined"
									onPress={() => handleDeleteMeeting(item.id)}
									color="#FF5722"
								>
									Delete
								</Button>
							</View>
						)}
					</Card.Content>
				</Card>
			</TouchableOpacity>
		);
	};


	const renderMeetingsList = () => {
		if (isLoading) {
			return <ActivityIndicator size="large" color="#4CAF50" />;
		}

		if (error) {
			return <Text style={styles.errorText}>{error}</Text>;
		}

		if (!meetings.length) {
			return <Text style={styles.noDataText}>No meetings scheduled yet.</Text>;
		}

		return (
			<FlatList
				data={meetings}
				renderItem={renderMeetingItem}
				keyExtractor={(item, index) => index.toString()}
				contentContainerStyle={styles.meetingList}
			/>
		);
	};


	return (
		<View style={styles.container}>
			{currentMember?.id === group?.created_by && (
				<TouchableOpacity
					style={styles.createButton}
					onPress={() => {
						setEditingMeeting(null);
						setIsModalVisible(true);
					}}
				>
					<Text style={styles.createButtonText}>Create New Meeting</Text>
				</TouchableOpacity>
			)}

			<CreateMeetingModal
				visible={isModalVisible}
				onClose={() => {
					setIsModalVisible(false);
					setEditingMeeting(null);
				}}
				onSubmit={editingMeeting ? handleEditMeeting : handleCreateMeeting}
				members={members}
				initialData={editingMeeting}
			/>

			<Text style={styles.title}>Scheduled Meetings</Text>
			{renderMeetingsList()}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#F5F5F5',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		color: '#333',
		textAlign: 'center',
	},
	createButton: {
		backgroundColor: '#4CAF50',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 20,
	},
	createButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	meetingList: {
		paddingBottom: 20,
	},
	meetingCard: {
		marginBottom: 16,
		elevation: 4,
		borderRadius: 8,
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	dateText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginLeft: 8,
		color: '#4CAF50',
	},
	agendaTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 4,
		color: '#333',
	},
	agendaText: {
		fontSize: 14,
		marginBottom: 8,
		color: '#666',
	},
	chairContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	chairText: {
		fontSize: 14,
		marginLeft: 8,
		color: '#666',
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
		marginTop: 10,
	},
	noDataText: {
		textAlign: 'center',
		marginTop: 10,
		fontStyle: 'italic',
		color: '#666',
	},
	meetingCard: {
		marginBottom: 10,
		borderRadius: 8,
		elevation: 3,
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	dateText: {
		marginLeft: 8,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	timeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 12,
		paddingHorizontal: 4,
	},
	timeItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	timeLabel: {
		marginLeft: 4,
		marginRight: 4,
		color: '#ffffff',
		fontSize: 14,
	},
	timeText: {
		fontSize: 14,
		color: '#ffffff',
	},
	agendaContainer: {
		flexDirection: 'row',
		marginBottom: 8,
	},
	agendaTitle: {
		fontWeight: 'bold',
		marginRight: 8,
		color: '#ffffff',
	},
	agendaText: {
		flex: 1,
		color: '#ffffff',
	},
	chairContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	chairText: {
		marginLeft: 8,
		color: '#ffffff',
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
});

export default SingleMeetingScreen;