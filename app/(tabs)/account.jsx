import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Loader from '../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import { group_transaction_url, member_group_wallet_url, member_transaction_url } from '../../api/api';


const AccountScreen = () => {
	const [member, setMember] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [transactions, setTransactions] = useState([]);
	const [wallets, setWallets] = useState([]);
	const [error, setError] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [balance, setBalance] = useState(0);
	const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
	const [depositAmount, setDepositAmount] = useState('');
	const [depositReason, setDepositReason] = useState('');
	const [selectedWalletId, setSelectedWalletId] = useState('');
	const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
	const [withdrawAmount, setWithdrawAmount] = useState('');
	const [withdrawReason, setWithdrawReason] = useState('');


	useEffect(() => {
		fetchMemberData();
	}, []);

	useEffect(() => {
		if (member && member.id) {
			fetchMemberTransactions(member.id);
			fetchAllGroupWallets();
		}
	}, [member]);

	const fetchMemberData = async () => {
		try {
			const memberData = await AsyncStorage.getItem("member");
			if (memberData) {
				const parsedMember = JSON.parse(memberData);
				setMember(parsedMember);
			}
		} catch (error) {
			console.error("Error fetching member data:", error);
			setError("Failed to fetch member data. Please try again.");
		}
	};

	const fetchAllGroupWallets = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${member_group_wallet_url}/${member.id}`);
			if (response.ok) {
				const data = await response.json();
				setWallets(data.data || []);
			} else {
				throw new Error('Failed to fetch group wallets');
			}
		} catch (error) {
			setError('Failed to fetch group wallets. Please try again later.');
			console.error('Error fetching group wallets:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchMemberTransactions = async (memberId) => {
		try {
			setIsLoading(true);
			const response = await fetch(`${member_transaction_url}/${memberId}`);
			if (response.ok) {
				const data = await response.json();
				setTransactions(data || []);
			} else {
				throw new Error('Failed to fetch member transactions');
			}
		} catch (error) {
			setError('Failed to fetch member transactions. Please try again later.');
			console.error('Error fetching member transactions:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const renderTransactionItem = ({ item }) => {
		const isDeposit = parseFloat(item.amount) > 0;
		return (
			<LinearGradient
				colors={isDeposit ? ['#00E394', '#00B377'] : ['#FF6B6B', '#FF3E3E']}
				style={[styles.transactionItem, styles.transactionShadow]}
			>
				<View style={styles.transactionHeader}>
					<Text style={styles.transactionAmount}>
						{isDeposit ? 'Deposit' : 'Withdraw'}{' '}
						<Text style={styles.currencySymbol}>
							{item?.wallet?.group?.group_currency || 'UGX'}
						</Text>{' '}
						{Math.abs(parseFloat(item.amount)).toFixed(2)}
					</Text>
					<Ionicons
						name={isDeposit ? 'arrow-up-circle' : 'arrow-down-circle'}
						size={28}
						color="#fff"
					/>
				</View>
				<Text style={styles.transactionReason}>{item.reason}</Text>
				<View style={styles.transactionDetails}>
					<Text style={styles.transactionDate}>
						{new Date(item.createdAt).toLocaleDateString()}
					</Text>
					<Text style={styles.transactionWallet}>
						{item.wallet?.group?.name || 'Unknown Wallet'}
					</Text>
				</View>
			</LinearGradient>
		);
	};


	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		fetchMemberTransactions(member.id).then(() => {
			setRefreshing(false);
		});
	}, [member]);

	const handleDeposit = () => {
		if (wallets.length === 0) {
			Alert.alert('Error', 'No wallets available. Please create a wallet first.');
			return;
		}
		setSelectedWalletId(wallets.id);
		setIsDepositModalVisible(true);
	};

	const handleWithdraw = () => {
		if (wallets.length === 0) {
			Alert.alert('Error', 'No wallets available. Please create a wallet first.');
			return;
		}
		setSelectedWalletId(wallets.id);
		setIsWithdrawModalVisible(true);
	};




	const submitDeposit = async () => {
		if (!depositAmount || !depositReason || !selectedWalletId) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

		try {
			setIsLoading(true);
			const response = await fetch(group_transaction_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					walletId: selectedWalletId,
					transType: 'deposit',
					createdBy: member.id,
					amount: depositAmount,
					reason: depositReason,
				}),
			});

			if (response.ok) {
				Alert.alert('Success', 'Deposit successful');
				setIsDepositModalVisible(false);
				setDepositAmount('');
				setDepositReason('');
				setSelectedWalletId('');
				fetchMemberTransactions(member.id);
			} else {
				throw new Error('Deposit failed');
			}
		} catch (error) {
			console.error('Error making deposit:', error);
			Alert.alert('Error', 'Failed to make deposit. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const submitWithdraw = async () => {
		if (!withdrawAmount || !withdrawReason || !selectedWalletId) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

		try {
			setIsLoading(true);
			const response = await fetch(group_transaction_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					walletId: selectedWalletId,
					transType: 'withdraw',
					createdBy: member.id,
					amount: withdrawAmount,
					reason: withdrawReason,
				}),
			});

			if (response.ok) {
				Alert.alert('Success', 'Withdrawal successful');
				setIsWithdrawModalVisible(false);
				setWithdrawAmount('');
				setWithdrawReason('');
				setSelectedWalletId('');
				fetchMemberTransactions(member.id);
			} else {
				throw new Error('Withdrawal failed');
			}
		} catch (error) {
			console.error('Error making withdrawal:', error);
			Alert.alert('Error', 'Failed to make withdrawal. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};


	const renderDepositModal = () => (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isDepositModalVisible}
			onRequestClose={() => setIsDepositModalVisible(false)}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Make a Deposit</Text>
					<Picker
						selectedValue={selectedWalletId}
						style={styles.picker}
						onValueChange={(itemValue) => setSelectedWalletId(itemValue)}
					>
						{wallets.map((wallet) => (
							<Picker.Item key={wallet.id} label={wallet?.group.name} value={wallet.id} />
						))}
					</Picker>
					<TextInput
						style={styles.input}
						placeholder="Amount"
						keyboardType="numeric"
						value={depositAmount}
						onChangeText={setDepositAmount}
					/>
					<TextInput
						style={styles.input}
						placeholder="Reason"
						value={depositReason}
						onChangeText={setDepositReason}
					/>
					<TouchableOpacity
						style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
						onPress={submitDeposit}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator size="small" color="#ffffff" />
						) : (
							<Text style={styles.submitButtonText}>Submit Deposit</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.cancelButton}
						onPress={() => setIsDepositModalVisible(false)}
						className="bg-red-500"
					>
						<Text style={styles.cancelButtonText} >Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);

	const renderWithdrawModal = () => (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isWithdrawModalVisible}
			onRequestClose={() => setIsWithdrawModalVisible(false)}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Make a Withdrawal</Text>
					<Picker
						selectedValue={selectedWalletId}
						style={styles.picker}
						onValueChange={(itemValue) => setSelectedWalletId(itemValue)}
					>
						{wallets.map((wallet) => (
							<Picker.Item key={wallet.id} label={wallet?.group.name} value={wallet.id} />
						))}
					</Picker>
					<TextInput
						style={styles.input}
						placeholder="Amount"
						keyboardType="numeric"
						value={withdrawAmount}
						onChangeText={setWithdrawAmount}
					/>
					<TextInput
						style={styles.input}
						placeholder="Reason"
						value={withdrawReason}
						onChangeText={setWithdrawReason}
					/>
					<TouchableOpacity
						style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
						onPress={submitWithdraw}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator size="small" color="#ffffff" />
						) : (
							<Text style={styles.submitButtonText}>Submit Withdrawal</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);




	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Loader isLoading={isLoading} />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				className="mb-16"
			>
				<LinearGradient
					colors={['#00E394', '#00B377']}
					style={styles.header}
				>
					<View>
						<Text>Account Balance</Text>
					</View>

				</LinearGradient>

				<View style={styles.cardContainer}>


					<LinearGradient
						colors={['#4c669f', '#3b5998', '#192f6a']}
						style={styles.card}
					>
						<View style={styles.cardContent}>
							<TouchableOpacity style={styles.actionButton} onPress={handleDeposit}>
								<Ionicons name="arrow-up-circle-outline" size={24} color="#00B377" />
								<Text style={styles.actionText}>Deposit</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.actionButton} onPress={handleWithdraw}>
								<Ionicons name="arrow-down-circle-outline" size={24} color="#FF3E3E" />
								<Text style={styles.actionText}>Withdraw</Text>
							</TouchableOpacity>
						</View>
					</LinearGradient>
					{/* </View> */}

					<View className="mt-10">
						<Text style={styles.sectionTitle}>Recent Transactions</Text>
						{transactions.length > 0 ? (
							<FlatList
								data={transactions}
								renderItem={renderTransactionItem}
								keyExtractor={(item) => item.id.toString()}
								contentContainerStyle={styles.transactionList}
							/>
						) : (
							<Text style={styles.noTransactionsText}>No transactions found.</Text>
						)}
					</View>
				</View>


			</ScrollView>
			{renderDepositModal()}
			{renderWithdrawModal()}

		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		padding: 20,
		alignItems: 'center',
		justifyContent: 'center',
		height: 150,
	},
	balanceTitle: {
		color: '#fff',
		fontSize: 18,
		marginBottom: 10,
	},
	balanceAmount: {
		color: '#fff',
		fontSize: 36,
		fontWeight: 'bold',
	},
	cardContainer: {
		padding: 20,
	},
	card: {
		borderRadius: 10,
		padding: 20,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	actionButton: {
		alignItems: 'center',
	},
	actionText: {
		color: '#fff',
		marginTop: 5,
	},
	chartContainer: {
		padding: 20,
		backgroundColor: '#fff',
		marginBottom: 20,
	},
	chartTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
	},
	transactionsContainer: {
		padding: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
	},
	transactionItem: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 15,
		marginBottom: 10,
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	transactionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	transactionAmount: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	transactionDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	transactionDate: {
		color: '#888',
	},
	transactionWallet: {
		color: '#888',
	},
	noTransactionsText: {
		textAlign: 'center',
		marginTop: 20,
		fontStyle: 'italic',
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
		marginTop: 20,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		width: '80%',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
		textAlign: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	},
	submitButton: {
		backgroundColor: '#00E394',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
	},
	submitButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	cancelButton: {
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
	},
	cancelButtonText: {
		color: '#ffffff',
	},
	submitButtonDisabled: {
		backgroundColor: '#7FE9C5',
	},
});

export default AccountScreen;