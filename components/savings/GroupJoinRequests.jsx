import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { group_join_request_url, join_request_url } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EnhancedLoader from '../../utils/EnhancedLoader';

const GroupJoinRequests = ({ groupId, group, currentMemberId }) => {
	const [joinRequests, setJoinRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [member, setMember] = useState(null);


	console.log('group creator: ', group)
	// console.log('current member: ', currentMemberId)





	useEffect(() => {
		fetchMemberData();
	}, []);

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



	useEffect(() => {
		fetchJoinRequests();
	}, [groupId]);

	const fetchJoinRequests = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${group_join_request_url}/${groupId}`);
			if (response.ok) {
				const data = await response.json();
				setJoinRequests(data);
			} else {
				throw new Error('Failed to fetch join requests');
			}
		} catch (error) {
			console.error('Error fetching join requests:', error);
			Alert.alert('Error', 'Failed to load join requests');
		} finally {
			setLoading(false);
		}
	};

	const handleAccept = async (requestId) => {
		try {
			setLoading(true);
			const response = await fetch(`${join_request_url}/${requestId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					// Add any necessary authentication headers here
				},
			});

			if (response.ok) {
				// Remove the accepted request from the local state
				setJoinRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
				Alert.alert('Success', 'Join request accepted successfully');
			} else {
				throw new Error('Failed to accept join request');
			}
		} catch (error) {
			console.error('Error accepting join request:', error);
			Alert.alert('Error', 'Failed to accept join request');
		} finally {
			setLoading(false);
		}
	};

	const handleReject = async (requestId) => {
		// Implement reject logic here
		Alert.alert('Reject', 'Implement reject logic');
	};

	const formatName = (user) => {
		const names = [user?.first_name, user?.last_name, user?.other_name];
		return names.filter(Boolean).join(' ');
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const renderRequestItem = ({ item }) => (
		<View style={styles.requestItem}>
			<View style={styles.userInfo}>
				<View style={styles.textContainer}>
					<Text style={styles.userName}>{formatName(item.requestedBy)}</Text>
					<Text style={styles.userDetail}>NIN: {item.requestedBy?.national_identification_number}</Text>
					<Text style={styles.userDetail}>Contact: {item.requestedBy?.contact_one}</Text>
					<Text style={styles.userDetail}>Gender: {item.requestedBy?.gender}</Text>
					<Text style={styles.userDetail}>Date of Birth: {formatDate(item.requestedBy?.date_of_birth)}</Text>
					<Text style={styles.userDetail}>Reason: {item.reason_for}</Text>
					<Text style={styles.requestDate}>Requested: {formatDate(item.createdAt)}</Text>
				</View>
			</View>
		
				<View style={styles.actionButtons}>
					<TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(item.id)}>
						<Text style={styles.buttonText}>Accept</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(item.id)}>
						<Text style={styles.buttonText}>Reject</Text>
					</TouchableOpacity>
				</View>
		
		</View>
	);

	if (loading) {
		return <EnhancedLoader isLoading={loading} message='Loading group join requests...' />;
	}
	return (
		<View style={styles.container}>
			{joinRequests.length === 0 ? (
				<Text style={styles.emptyText}>No pending join requests</Text>
			) : (
				<FlatList
					data={joinRequests}
					renderItem={renderRequestItem}
					keyExtractor={(item) => item.id.toString()}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#4a148c',
		marginBottom: 12,
	},
	loadingText: {
		textAlign: 'center',
		color: '#6b46c1',
		fontSize: 16,
	},
	emptyText: {
		textAlign: 'center',
		color: '#9e9e9e',
		fontSize: 16,
	},
	requestItem: {
		flexDirection: 'column',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		paddingVertical: 12,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 8,
	},
	textContainer: {
		marginLeft: 12,
		flex: 1,
	},
	userName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4,
	},
	userDetail: {
		fontSize: 14,
		color: '#555',
		marginBottom: 2,
	},
	requestDate: {
		fontSize: 14,
		color: '#757575',
		marginTop: 4,
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 8,
	},
	button: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		marginLeft: 8,
	},
	acceptButton: {
		backgroundColor: '#4caf50',
	},
	rejectButton: {
		backgroundColor: '#f44336',
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
});

export default GroupJoinRequests;