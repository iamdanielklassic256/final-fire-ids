import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Loader from '../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import { group_money_request_url, group_transaction_url, member_group_wallet_url, member_transaction_url } from '../../api/api';
import NoTransaction from '../../components/account/NoTransaction';
import MoneyRequestModal from '../../components/account/MoneyRequestModal';
import DepositModal from '../../components/account/DepositModal';


const AccountScreen = () => {
	const [member, setMember] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [transactions, setTransactions] = useState([]);
	const [wallets, setWallets] = useState([]);
	const [error, setError] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
	const [depositAmount, setDepositAmount] = useState('');
	const [depositReason, setDepositReason] = useState('');
	const [selectedWalletId, setSelectedWalletId] = useState('');
	const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
	const [withdrawAmount, setWithdrawAmount] = useState('');
	const [withdrawReason, setWithdrawReason] = useState('');
	const [activeTab, setActiveTab] = useState('transactions');
	const [moneyRequests, setMoneyRequests] = useState([]);


	const [isMoneyRequestModalVisible, setIsMoneyRequestModalVisible] = useState(false);
	const [groups, setGroups] = useState([]); // You'll need to fetch these
	const [requestTypes, setRequestTypes] = useState([]); // You'll need to fetch these




	const handleMoneyRequest = () => {
		setIsMoneyRequestModalVisible(true);
	};

	const submitMoneyRequest = async (requestData) => {
		try {
			console.log('account side:', requestData)
			setIsLoading(true);
			// Make API call to submit the money request
			// If successful:
			const response = await fetch(group_money_request_url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData),
			});
			if (!response.ok) throw new Error('Failed to request for money');
			setIsMoneyRequestModalVisible(false);
			Alert.alert('Success', 'Money request submitted successfully');
		} catch (error) {
			console.error('Error submitting money request:', error);
			Alert.alert('Error', 'Failed to submit money request. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};



	useEffect(() => {
		fetchMemberData();
	}, []);

	useEffect(() => {
		if (member && member.id) {
			fetchMemberTransactions(member.id);
			fetchAllGroupWallets();
			fetchGroupMoneyRequests()
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

	const fetchGroupMoneyRequests = async (memberId) => {
		try {
			setIsLoading(true);
			const response = await fetch(`${group_money_request_url}`);
			if (response.ok) {
				const data = await response.json();
				setMoneyRequests(data.data || []);
				console.log('Group Money Requests:', data.data); // Console log the fetched data
			} else {
				throw new Error('Failed to fetch group money requests');
			}
		} catch (error) {
			setError('Failed to fetch group money requests. Please try again later.');
			console.error('Error fetching group money requests:', error);
		} finally {
			setIsLoading(false);
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

	// console.log(wallets)

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
		const isDeposit = item.transType === 'deposit';
		return (
			<LinearGradient
				colors={isDeposit ? ['#00E394', '#00B377'] : ['#FF6B6B', '#FF3E3E']}
				style={[styles.transactionItem, styles.transactionShadow]}
				className="mx-4"
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
		setIsDepositModalVisible(true);
	};





	const submitDeposit = async (depositData) => {
		try {
			setIsLoading(true);
			const response = await fetch(group_transaction_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					walletId: depositData.walletId,
					transType: 'deposit',
					createdBy: member.id,
					amount: depositData.amount,
					reason: depositData.reason,
				}),
			});

			if (response.ok) {
				Alert.alert('Success', 'Deposit successful');
				setIsDepositModalVisible(false);
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





	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}




	const renderMoneyRequestItem = ({ item }) => {
		const statusColors = {
			pending: '#FFA500',
			approved: '#4CAF50',
			rejected: '#F44336',
		};

		return (
			<LinearGradient
				colors={['#F0F0F0', '#E0E0E0']}
				style={[styles.moneyRequestItem, styles.transactionShadow]}
			>
				<View style={styles.moneyRequestHeader}>
					<Text style={styles.moneyRequestAmount}>
						<Text style={styles.currencySymbol}>UGX </Text>
						{item.amount_requested}
					</Text>
					<View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
				</View>
				<Text style={styles.requesterName}>{`${item.requested_by.first_name} ${item.requested_by.last_name}`}</Text>
				<Text style={styles.groupName}>{item.group.name}</Text>
				<Text style={styles.moneyRequestDate}>
					{new Date(item.createdAt).toLocaleDateString()}
				</Text>
			</LinearGradient>
		);
	};

	const renderTabs = () => (
		<View style={styles.tabContainer} className="mx-4">
			<TouchableOpacity
				style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
				onPress={() => setActiveTab('transactions')}
			>
				<Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>Transactions</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.tab, activeTab === 'moneyRequests' && styles.activeTab]}
				onPress={() => setActiveTab('moneyRequests')}
			>
				<Text style={[styles.tabText, activeTab === 'moneyRequests' && styles.activeTabText]}>Money Requests</Text>
			</TouchableOpacity>
		</View>
	);

	const renderHeader = () => (
		<>
			<LinearGradient
				colors={['#00E394', '#00B377']}
				style={styles.header}
			>
				<View>
					<Text style={styles.balanceTitle}>Account Balance</Text>
					<Text style={styles.balanceAmount}>UGX 1,000,000</Text>
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
						<TouchableOpacity style={styles.actionButton} onPress={handleMoneyRequest}>
							<Ionicons name="arrow-down-circle-outline" size={24} color="#FF3E3E" />
							<Text style={styles.actionText}>Make  Request</Text>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</View>
			{renderTabs()}
		</>
	);

	const renderContent = () => {
		if (activeTab === 'transactions') {
			return (
				<FlatList
					data={transactions}
					renderItem={renderTransactionItem}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={styles.listContent}
					ListEmptyComponent={<Text style={styles.noDataText}>No transactions found.</Text>}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					ListHeaderComponent={renderHeader}
				/>
			);
		} else {
			return (
				<FlatList
					data={moneyRequests}
					renderItem={renderMoneyRequestItem}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={styles.listContent}
					ListEmptyComponent={<NoTransaction />}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					ListHeaderComponent={renderHeader}
				/>
			);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Loader isLoading={isLoading} />
			{renderContent()}
			<DepositModal
				isVisible={isDepositModalVisible}
				onClose={() => setIsDepositModalVisible(false)}
				onSubmit={submitDeposit}
				wallets={wallets}
				isLoading={isLoading}
			/>
			{/* {renderWithdrawModal()} */}
			<MoneyRequestModal
				isVisible={isMoneyRequestModalVisible}
				onClose={() => setIsMoneyRequestModalVisible(false)}
				onSubmit={submitMoneyRequest}
				isLoading={isLoading}
			/>
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
	tabContainer: {
		flexDirection: 'row',
		marginBottom: 15,
		borderRadius: 10,
		overflow: 'hidden',
		backgroundColor: '#E0E0E0',
	},
	tab: {
		flex: 1,
		paddingVertical: 10,
		alignItems: 'center',
	},
	activeTab: {
		backgroundColor: '#00B377',
	},
	tabText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	activeTabText: {
		color: '#FFF',
	},
	moneyRequestItem: {
		borderRadius: 10,
		padding: 15,
		marginBottom: 10,
	},
	moneyRequestHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5,
	},
	moneyRequestAmount: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	requesterName: {
		fontSize: 16,
		marginBottom: 5,
	},
	moneyRequestDate: {
		color: '#888',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		color: '#FFF',
		fontSize: 12,
		fontWeight: 'bold',
	},
	listContainer: {
		padding: 16,
	},
	moneyRequestItem: {
		padding: 16,
		borderRadius: 8,
		marginBottom: 16,
	},
	transactionShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},
	moneyRequestHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	moneyRequestAmount: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	currencySymbol: {
		fontSize: 14,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
	},
	statusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: 'bold',
	},
	requesterName: {
		fontSize: 16,
		marginBottom: 4,
	},
	moneyRequestDate: {
		fontSize: 14,
		color: '#666',
	},
});

export default AccountScreen;