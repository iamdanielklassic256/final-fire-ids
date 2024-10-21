import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import { formatMemberName } from '../../utils/formatName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { group_money_request_approval_url, group_money_request_url } from '../../api/api';

const LoanCard = ({ loan, onStatusUpdate }) => {
	const [member, setMember] = useState(null);
	const [isApproving, setIsApproving] = useState(false);
	const [isRejecting, setIsRejecting] = useState(false);

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
		}
	};

	const handleApprove = async () => {
		try {
			setIsApproving(true);
			const response = await fetch(group_money_request_approval_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					requestId: loan.id,
					groupMemberId: member.id,
				}),
			});

			if (response.ok) {
				// await response.json();
				Alert.alert('Success', 'Loan request approved successfully');
			} else {
				const errorData = await response.json();
				Alert.alert('Error', errorData.message || 'Failed to approve loan request');
			}
		} catch (error) {
			console.error('Error approving loan:', error);
			Alert.alert('Error', 'An unexpected error occurred');
		} finally {
			setIsApproving(false);
		}
	};

	const handleDecline = async () => {
		try {
			setIsRejecting(true);
			const response = await fetch(`${group_money_request_url}/${loan.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					groupMemberId: member.id,
				}),
			});

			if (response.ok) {
				
				Alert.alert('Success', 'Loan request declined successfully');
			}
		} catch (error) {
			console.error('Error declining loan:', error);
			Alert.alert('Error', 'An unexpected error occurred');
		} finally {
			setIsRejecting(false);
		}
	};

	const renderActionButtons = () => {
		if (loan.status === 'approved') {
			return (
				<Text style={[styles.status, styles.approved]}>Approved</Text>
			);
		}

		return (
			<>
				<TouchableOpacity style={styles.actionButton} onPress={handleApprove} disabled={isApproving}>
					{isApproving ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<>
							<FontAwesome5 name="check" size={18} color="white" />
							<Text style={styles.actionButtonText}>Approve</Text>
						</>
					)}
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.actionButton, styles.rejectButton]}
					onPress={handleDecline}
					disabled={isRejecting}
				>
					{isRejecting ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<>
							<FontAwesome5 name="times" size={18} color="white" />
							<Text style={styles.actionButtonText}>Reject</Text>
						</>
					)}
				</TouchableOpacity>
			</>
		);
	};

	return (
		<View style={styles.card}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Text style={styles.title}>
						{formatMemberName(loan.requested_by)}
					</Text>
					<Text style={styles.details}>
						{moment(loan.start_on).format('MMM D, YYYY')} - {moment(loan.end_on).format('MMM D, YYYY')}
					</Text>
				</View>
				<View style={styles.headerRight}>
					<Text style={styles.amount}>UGX {loan.amount_requested}</Text>
					<Text style={[styles.status, loan.status === 'pending' ? styles.pending : styles.approved]}>
						{loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
					</Text>
				</View>
			</View>
			<View style={styles.body}>
				<Text style={styles.details}>Reason: {loan.reason}</Text>
				<Text style={styles.details}>Duration: {loan.duration.name}</Text>
			</View>
			<View style={styles.footer}>
				{renderActionButtons()}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
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
		marginVertical: 10,
		paddingVertical: 16,
		paddingHorizontal: 16,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	amount: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007AFF',
	},
	body: {
		marginBottom: 12,
	},
	details: {
		fontSize: 14,
		color: '#666',
		marginVertical: 2,
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
	declined: {
		backgroundColor: '#FF3B30',
	},
	approved: {
		backgroundColor: '#34C759',
	},
	countdownContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	countdownContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFA500', // Orange color for countdown
	},
	countdownText: {
		color: 'white',
		marginLeft: 8,
		fontSize: 16,
		fontWeight: 'bold',
	},

});


export default LoanCard;