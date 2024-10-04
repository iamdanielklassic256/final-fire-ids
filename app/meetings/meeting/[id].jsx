import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { all_members_in_a_group, group_meeting_url, group_meetings_attendance_url, meeting_attendance_url } from '../../../api/api';
import AttendanceModal from '../../../components/savings/AttendanceModal';
import AttendanceData from '../../../components/AttendanceData';
import { formatMemberName } from '../../../utils/formatName';

const MeetingItemDetail = () => {
	const { id } = useLocalSearchParams();
	const [meeting, setMeeting] = useState(null);
	const [groupMembers, setGroupMembers] = useState([]);
	const [attendanceData, setAttendanceData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const fetchMeetingDetailsAndAttendance = useCallback(async () => {
		try {
			setLoading(true);
			const [meetingResponse, membersResponse, attendanceResponse] = await Promise.all([
				fetch(`${group_meeting_url}/${id}`),
				fetch(`${all_members_in_a_group}/${meeting?.groupId}`),
				fetch(`${group_meetings_attendance_url}/${id}`)
			]);

			if (!meetingResponse.ok || !membersResponse.ok || !attendanceResponse.ok) {
				throw new Error('Failed to fetch data');
			}

			const [meetingData, membersData, attendanceData] = await Promise.all([
				meetingResponse.json(),
				membersResponse.json(),
				attendanceResponse.json()
			]);

			setMeeting(meetingData);
			if (Array.isArray(membersData.members)) {
				setGroupMembers(membersData.members);
			} else {
				console.error('Members data is not an array:', membersData);
				setGroupMembers([]);
			}
			setAttendanceData(attendanceData);
		} catch (err) {
			console.error('Error fetching data:', err);
			setError(err.message);
			Alert.alert("Error", err.message);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [id, meeting?.groupId]);

	useEffect(() => {
		fetchMeetingDetailsAndAttendance();
	}, [fetchMeetingDetailsAndAttendance]);

	const handleOpenModal = () => {
		if (groupMembers.length === 0) {
			Alert.alert("No Members", "There are no members in this group to record attendance for.");
		} else {
			setModalVisible(true);
		}
	};

	const handleDelete = async (attendanceId) => {
		try {
			setLoading(true);
			const response = await fetch(`${meeting_attendance_url}/${attendanceId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete attendance');
			}

			setAttendanceData(prevData => prevData.filter(item => item.id !== attendanceId));
			Alert.alert("Success", "Attendance record deleted successfully");
		} catch (err) {
			console.error('Delete error:', err);
			Alert.alert("Error", `Failed to delete attendance: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchMeetingDetailsAndAttendance();
	}, [fetchMeetingDetailsAndAttendance]);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>Error: {error}</Text>
				<TouchableOpacity style={styles.retryButton} onPress={fetchMeetingDetailsAndAttendance}>
					<Text style={styles.retryButtonText}>Retry</Text>
				</TouchableOpacity>
			</View>
		);
	}


	const GroupCreator = meeting.group?.created_by


	console.log("Group Creator::", GroupCreator)

	return (
		<>
			<ScrollView
				style={styles.container}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				className=""
			>
				<View style={styles.header}>
					<MaterialIcons name="group" size={24} color="#3498db" />
					<Text style={styles.title}>{meeting?.group?.name} Meeting</Text>
				</View>
				<View style={styles.detailsContainer}>
					<DetailItem
						icon="event"
						label="Date"
						value={moment(meeting?.scheduled_date).format('MMMM D, YYYY')}
					/>
					<DetailItem
						icon="schedule"
						label="Time"
						value={`${moment(meeting?.start_time).format('h:mm A')} - ${moment(meeting?.end_time).format('h:mm A')}`}
					/>
					<DetailItem icon="person" label="Chaired by" value={formatMemberName(meeting?.ChairedBy)} />
					<DetailItem icon="assignment" label="Agenda" value={meeting?.agenda} />
					<DetailItem icon="summarize" label="Summary" value={meeting?.summary} />
				</View>

				<View className="mb-10">
					<Text style={styles.subtitle}>Attendance</Text>
					{attendanceData.length > 0 ? (
						attendanceData.map((attendance, index) => (
							<AttendanceData
								key={index}
								attendance={attendance}
								onDelete={handleDelete}
								loading={loading}
							/>
						))
					) : (
						<Text style={styles.noDataText}>No attendance data available</Text>
					)}
				</View>

				<AttendanceModal
					isVisible={modalVisible}
					onClose={() => setModalVisible(false)}
					groupMeetingId={id}
					groupMembers={groupMembers}
					onAttendanceRecorded={fetchMeetingDetailsAndAttendance}
				/>
			</ScrollView>
			<TouchableOpacity
				style={styles.attendanceButton}
				onPress={handleOpenModal}
			>
				<MaterialIcons name="add" size={24} color="white" />
				<Text style={styles.attendanceButtonText}>Record Attendance</Text>
			</TouchableOpacity>
		</>
	);
};

const DetailItem = ({ icon, label, value }) => (
	<View style={styles.detailItem}>
		<MaterialIcons name={icon} size={20} color="#7f8c8d" />
		<Text style={styles.label}>{label}: <Text style={styles.value}>{value}</Text></Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginLeft: 10,
		color: '#3498db',
	},
	subtitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 10,
		color: '#2c3e50',
	},
	detailsContainer: {
		backgroundColor: '#ffffff',
		borderRadius: 8,
		padding: 15,
		marginBottom: 20,
		elevation: 3,
	},
	detailItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
		marginLeft: 10,
		color: '#34495e',
	},
	value: {
		fontWeight: 'normal',
		color: '#7f8c8d',
	},
	errorText: {
		color: 'red',
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 20,
	},
	retryButton: {
		backgroundColor: '#3498db',
		padding: 10,
		borderRadius: 5,
		alignSelf: 'center',
	},
	retryButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	attendanceButton: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		backgroundColor: '#4CAF50',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 15,
		borderRadius: 30,
		elevation: 5,
	},
	attendanceButtonText: {
		color: 'white',
		fontWeight: 'bold',
		marginLeft: 5,
	},
	noDataText: {
		fontStyle: 'italic',
		color: '#888',
		textAlign: 'center',
	},
});

export default MeetingItemDetail;