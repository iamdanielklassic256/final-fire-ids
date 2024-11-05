import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import WalletTransactions from '../../components/account/WalletTransactions';
import AddDepositModal from '../../components/account/AddDepositModal';
import EnhancedLoader from '../../utils/EnhancedLoader';
import WalletHeader from '../../components/wallets/WalletHeader';

const SingleWallet = () => {
	const { id } = useLocalSearchParams();
	const [wallet, setWallet] = useState(null);
	const [loading, setLoading] = useState(true);

	const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("Loading your group wallet...");

	const loadingMessages = [
		"Loading wallet information...",
		"Wallet information",
		"Loading wallet transactions..."
	];


	useEffect(() => {
		// Simulating API call to fetch wallet data
		const fetchWallet = async () => {
			try {
				setLoading(true);
				setLoadingMessage(loadingMessages[0]);
				// Replace this with actual API call using the id
				const response = await fetch(`https://akiba-sacco-api.onrender.com/group-wallet/${id}`);
				const data = await response.json();
				setWallet(data); // Assuming the API returns an array with a single wallet
			} catch (error) {
				console.error('Error fetching wallet:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchWallet();
	}, [id]);

	useEffect(() => {
		let messageInterval;
		if (loading) {
			messageInterval = setInterval(() => {
				setLoadingMessage(prev => {
					const currentIndex = loadingMessages.indexOf(prev);
					const nextIndex = (currentIndex + 1) % loadingMessages.length;
					return loadingMessages[nextIndex];
				});
			}, 2000); // Change message every 2 seconds
		}
		return () => clearInterval(messageInterval);
	}, [loading]);



	if (!wallet) {
		return (
			<View style={styles.errorContainer}>
				<Text>Failed to load wallet information.</Text>
			</View>
		);
	}

	const progress = parseFloat(wallet.total_balance) / parseFloat(wallet.goal);


	console.log('Group Wallet :: GroupId', wallet.groupId)

	const renderHeader = () => (
		<>
			<View style={styles.header}>
				<Text style={styles.title}>{wallet.name} Wallet</Text>
				<Text style={styles.groupName}>{wallet.group?.name}</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.label}>Balance</Text>
				<Text style={styles.balance}>{wallet.group?.group_curency} {parseFloat(wallet?.total_balance).toLocaleString()}</Text>
				<Text style={styles.goal}>Goal: {wallet.group?.group_curency} {parseFloat(wallet?.goal).toLocaleString()}</Text>
				<ProgressBar progress={progress} color="#4CAF50" style={styles.progressBar} />
				<Text style={styles.progressText}>{(progress * 100).toFixed(2)}% Achieved</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.sectionTitle}>Wallet Details</Text>
				<Text style={styles.detail}>Description: {wallet.description}</Text>
				<Text style={styles.detail}>Created: {new Date(wallet.createdAt).toLocaleDateString()}</Text>
				<Text style={styles.detail}>Last Updated: {new Date(wallet.updatedAt).toLocaleDateString()}</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.sectionTitle}>Group Information</Text>
				<Text style={styles.detail}>Share Value: {wallet.group?.group_curency} {parseFloat(wallet.group?.share_value).toLocaleString()}</Text>
				<Text style={styles.detail}>Interest Rate: {wallet.group?.interate_rate}%</Text>
				<Text style={styles.detail}>Saving Delay Fine: {wallet.group?.group_curency} {parseFloat(wallet.group?.saving_delay_fine).toLocaleString()}</Text>
			</View>

			<TouchableOpacity
				style={styles.depositButton}
				onPress={() => setIsDepositModalVisible(true)}
			>
				<Ionicons name="add-circle-outline" size={24} color="#fff" />
				<Text style={styles.depositButtonText}>Make Deposit</Text>
			</TouchableOpacity>

			{isDepositModalVisible && (
				<AddDepositModal
					groupId={wallet.groupId}
					walletId={wallet.id}
					onClose={() => setIsDepositModalVisible(false)}
				/>
			)}
			<Text style={styles.transactionsTitle}>Recent Contributions</Text>
		</>
	);

	return (
		<View style={styles.container}>
			<WalletTransactions
				walletId={wallet.id}
				ListHeaderComponent={<WalletHeader wallet={wallet} />}
			/>


			<EnhancedLoader isLoading={loading} message={loadingMessage} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		backgroundColor: '#1976D2',
		padding: 20,
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
	},
	groupName: {
		fontSize: 18,
		color: 'white',
		marginTop: 5,
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 8,
		padding: 16,
		margin: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	label: {
		fontSize: 14,
		color: '#666',
	},
	balance: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#4CAF50',
		marginVertical: 5,
	},
	goal: {
		fontSize: 16,
		color: '#666',
		marginBottom: 10,
	},
	progressBar: {
		height: 10,
		borderRadius: 5,
	},
	progressText: {
		textAlign: 'right',
		marginTop: 5,
		color: '#4CAF50',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333',
	},
	detail: {
		fontSize: 16,
		marginBottom: 5,
		color: '#444',
	},
	button: {
		backgroundColor: '#4CAF50',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
		borderRadius: 8,
		margin: 10,
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 10,
	},
	transactionsTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 10,
		marginLeft: 10,
		color: '#333',
	},
	depositButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#4CAF50',
		padding: 15,
		borderRadius: 10,
		marginHorizontal: 10,
		marginBottom: 10,
	},
	depositButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 10,
	},

});

export default SingleWallet;