import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import ActionButton from '../utils/ActionButton';
import { all_savings_groups_by_member_id, group_wallet_url, member_group_wallet_type_url, member_group_wallet_url } from '../api/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader'

const Wallet = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [wallets, setWallets] = useState([])
	const [error, setError] = useState(null);
	const [member, setMember] = useState(null);

	useEffect(() => {
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

		fetchMemberData();
	}, []);

	useEffect(() => {
		if (member && member.id) {
			fetchAllGroupWallets();
		}
	}, [member, wallets]);

	const fetchAllGroupWallets = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${member_group_wallet_url}/${member.id}`);
			if (response.ok) {
				const data = await response.json();
				setWallets(data.data || []);
				setIsLoading(false)
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

	//   console.log('Wallets:', wallets)

	const renderWalletItem = ({ item }) => (
		<TouchableOpacity
			style={styles.walletItem}
			onPress={() => router.push(`/wallet/${item.id}`)}
		>
			<Text style={styles.walletName}>{item.group.name}</Text>
			<Text style={styles.walletType}>{item.WalletType.name}</Text>
			<Text style={styles.walletBalance}>Balance: {item.total_balance} {item.group.group_curency}</Text>
			<Text style={styles.walletGoal}>Goal: {item.goal}</Text>
		</TouchableOpacity>
	);

	const onCreateNewWallet = () => {
		router.push('/wallet/add-wallet');
	}

	if (isLoading) {
		return <Loader isLoading={isLoading} />;
	}

	if (error) {
		return <View style={styles.centered}><Text>{error}</Text></View>;
	}

	return (
		<View style={styles.container}>
			<View style={styles.actionButtonContainer}>
				<ActionButton
					icon="add-circle-outline"
					label="New Wallet"
					onPress={onCreateNewWallet}
				/>
				<ActionButton
					icon="wallet-outline"
					label="Wallet Types"
					onPress={() => router.push('/wallet/wallet_type')}
				/>
			</View>

			<FlatList
				data={wallets}
				renderItem={renderWalletItem}
				keyExtractor={(item) => item.id}
				style={styles.list}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	actionButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	list: {
		flex: 1,
	},
	walletItem: {
		backgroundColor: '#ffffff',
		borderRadius: 8,
		padding: 15,
		marginBottom: 10,
		elevation: 2,
	},
	walletName: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	walletType: {
		fontSize: 14,
		color: '#666',
	},
	walletBalance: {
		fontSize: 16,
		marginTop: 5,
	},
	walletGoal: {
		fontSize: 14,
		color: '#666',
		marginTop: 5,
	},
});

export default Wallet