import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { group_money_request_url } from '../../api/api';
import Loader from '../Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoanCard from './LoanCard';
import EnhancedLoader from '../../utils/EnhancedLoader';

const GroupLoans = ({ groupId, group }) => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [member, setMember] = useState(null);






	// console.log('group creator: ', groupId)
	// console.log('current member: ', currentMemberId)

	const GroupCreatorId = group.created_by

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
		fetchAllMoneyRequests();
	}, [groupId]);

	const fetchAllMoneyRequests = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${group_money_request_url}/group/${groupId}`);
			// if (response.status === 200) {
				const data = await response.json();
				setRequests(data?.data);
			// } else {
			// 	throw new Error('Failed to fetch join requests');
			// }
		} catch (error) {
			console.error('Error fetching join requests:', error);
			Alert.alert('Error', 'Failed to load join requests');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		<EnhancedLoader isLoading={loading} message='Loading loans...' />
	  }

	  console.log(requests)



	return (
		<View>
				<FlatList
					data={requests}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) =>
						<LoanCard
							loan={item}
						/>}
					contentContainerStyle={styles.container}

				/>

		</View>
	)
}

export default GroupLoans


const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 24,
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginVertical: 12,
		paddingVertical: 16,
		paddingHorizontal: 16,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	headerLeft: {
		flex: 1,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	headerRight: {
		alignItems: 'flex-end',
	},
	amount: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007AFF',
	},
	details: {
		fontSize: 14,
		color: '#666',
	},
	status: {
		fontSize: 14,
		fontWeight: 'bold',
		marginTop: 4,
	},
	pending: {
		color: '#FFA500',
	},
	approved: {
		color: '#4CAF50',
	},
	body: {
		marginBottom: 12,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	actionButton: {
		backgroundColor: '#007AFF',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 4,
		flexDirection: 'row',
		alignItems: 'center',
	},
	rejectButton: {
		backgroundColor: '#FF3B30',
	},
	actionButtonText: {
		color: 'white',
		marginLeft: 8,
		fontSize: 14,
		fontWeight: 'bold',
	},
});
