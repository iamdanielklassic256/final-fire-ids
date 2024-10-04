import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceData = ({ attendance, onDelete, loading, GroupCreator }) => {
	const [deleteAnim] = useState(new Animated.Value(1));
	const [member, setMember] = useState(null);


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

		fetchMemberData(); // Fetch invitations on component load
	}, []);


	const currentMemberId = member?.id;

	console.log(currentMemberId)

	const formatMemberName = (member) => {
		const names = [member.first_name, member.last_name, member.other_name].filter(Boolean);
		return names.join(' ');
	};

	const formatTime = (timeString) => {
		const date = new Date(timeString);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const getStatusInfo = (time) => {
		const arrivalTime = new Date(time);
		const expectedTime = new Date(time);
		expectedTime.setHours(9, 0, 0, 0);
		const timeDifference = (arrivalTime - expectedTime) / (1000 * 60); // difference in minutes

		if (timeDifference < 0) return { color: '#4CAF50', text: 'Early', icon: 'check-circle' };
		if (timeDifference <= 30) return { color: '#FFC107', text: 'On Time', icon: 'schedule' };
		return { color: '#F44336', text: 'Late', icon: 'warning' };
	};

	const handleDelete = () => {
		console.log('Delete Me: Attendance Data with ID: ', attendance?.id);
		onDelete(attendance.id);
	};

	const statusInfo = getStatusInfo(attendance.arrival_time);

	return (
		<Animated.View style={[styles.container, { opacity: deleteAnim }]}>
			<View style={styles.card}>
				<View style={styles.header}>
					<MaterialIcons name={statusInfo.icon} size={24} color={statusInfo.color} />
					<Text style={styles.headerText}>{formatMemberName(attendance.presentMember)}</Text>
				</View>
				<View style={styles.content} className="flex flex-row justify-between items-center">
					<View style={styles.statusContainer}>
						<Text style={styles.label}>Status:</Text>
						<Text style={[styles.value, { color: statusInfo.color }]}>{statusInfo.text}</Text>
					</View>
					<View style={styles.timeContainer}>
						<MaterialIcons name="access-time" size={18} color={statusInfo.color} />
						<Text style={[styles.value, { color: statusInfo.color }]}>
							{formatTime(attendance.arrival_time)}
						</Text>
					</View>
					{currentMemberId === GroupCreator && (
						<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
							<MaterialIcons name="delete" size={20} color="#ffffff" />
							{loading ? (
								<View>
									<ActivityIndicator size="small" color="#0000ff" />
									<Text>Deleting...</Text>
								</View>
							) : (
								<Text style={styles.deleteButtonText}></Text>
							)}
						</TouchableOpacity>
					)}

				</View>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 4,
		backgroundColor: '#f5f5f5',
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 8,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	headerText: {
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 8,
		color: '#3498db',
	},
	content: {
		marginBottom: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	statusContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	label: {
		fontSize: 14,
		color: '#7f8c8d',
		marginRight: 4,
	},
	value: {
		fontSize: 16,
		fontWeight: '500',
	},
	timeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	deleteButton: {
		backgroundColor: '#e74c3c',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 2,
		borderRadius: 4,
	},
	deleteButtonText: {
		color: '#ffffff',
		marginLeft: 2,
		fontWeight: '500',
	},
});

export default AttendanceData;