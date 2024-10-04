import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AttendanceData = ({ attendance, onDelete, loading }) => {
	const [deleteAnim] = useState(new Animated.Value(1));

	const formatMemberName = (member) => {
		const names = [member.first_name, member.last_name, member.other_name].filter(Boolean);
		return names.join(' ');
	};

	const formatTime = (timeString) => {
		const date = new Date(timeString);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const getStatusColor = (time) => {
		const arrivalHour = new Date(time).getHours();
		if (arrivalHour < 9) return '#4CAF50'; // Early: Green
		if (arrivalHour === 9) return '#FFC107'; // On time: Yellow
		return '#F44336'; // Late: Red
	};

	const handleDelete = () => {
		console.log('Delete Me: Attendance Data with ID: ', attendance?.id);
		onDelete(attendance.id);
	};

	const getStatusIcon = (time) => {
		const arrivalHour = new Date(time).getHours();
		if (arrivalHour < 9) return <MaterialIcons name="check-circle" size={24} color="#4CAF50" />;
		if (arrivalHour === 9) return <MaterialIcons name="schedule" size={24} color="#FFC107" />;
		return <MaterialIcons name="warning" size={24} color="#F44336" />;
	};

	return (
		<Animated.View style={[styles.container, { opacity: deleteAnim }]}>
			<View style={styles.card}>
				<View style={styles.header}>
					{getStatusIcon(attendance.arrival_time)}
					<Text style={styles.headerText}>{formatMemberName(attendance.presentMember)}</Text>
				</View>
				<View style={styles.content} className="flex flex-row justify-between items-center">
					<Text style={styles.label}>Arrival Time:</Text>
					<View style={styles.timeContainer}>
						<MaterialIcons name="access-time" size={18} color={getStatusColor(attendance.arrival_time)} />
						<Text style={[styles.value, { color: getStatusColor(attendance.arrival_time) }]}>
							{formatTime(attendance.arrival_time)}
						</Text>
					</View>
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
	},
	label: {
		fontSize: 14,
		color: '#7f8c8d',
		marginBottom: 4,
	},
	value: {
		fontSize: 16,
		color: '#2c3e50',
		fontWeight: '500',
		marginLeft: 4,
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
		marginTop: 8,
	},
	deleteButtonText: {
		color: '#ffffff',
		marginLeft: 2,
		fontWeight: '500',
	},
});

export default AttendanceData;