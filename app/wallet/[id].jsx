import React, { useCallback, useEffect, useState } from 'react'
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	Alert,
	RefreshControl,
	Modal
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios';
import { group_wallet_url, saving_group_url } from '../../api/api';
import { StatusBar } from 'expo-status-bar';
import EnhancedLoader from '../../utils/EnhancedLoader';
import AkibaHeader from '../../components/AkibaHeader';
import AddNewWalletSection from '../../components/wallet/AddNewWalletSection';

const GroupWallet = () => {
	const { id } = useLocalSearchParams();
	const [loading, setLoading] = useState(true);
	const [wallets, setWallets] = useState([])
	const [refreshing, setRefreshing] = useState(false);
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedWallet, setSelectedWallet] = useState(null);
	const [group, setGroup] = useState({})


	useEffect(() => {
		const fetchGroupDetails = async () => {
			try {

				const response = await axios.get(`${saving_group_url}/${id}`);

				setGroup(response?.data)

				// Populate initial state with group data

			} catch (error) {
				console.error("Error fetching group details:", error);
				Alert.alert("Error", "Failed to load group details");
			} finally {
				setLoading(false);
			}
		};

		fetchGroupDetails();
	}, [id]);

	useEffect(() => {


		fetchWalletDetails();
	}, [id]);

	const fetchWalletDetails = async () => {
		try {
			const response = await axios.get(`${group_wallet_url}/group/${id}`);
			setWallets(response?.data.data)
		} catch (error) {
			console.error("Error fetching group details:", error);
			Alert.alert("Error", "Failed to load group details");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWalletDetails();
	}, [fetchWalletDetails]);


	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchWalletDetails();

	}, [fetchWalletDetails]);


	const openModal = (wallet) => {
		setSelectedWallet(wallet);
		setModalVisible(true);
	};

	const closeModal = () => {
		setSelectedWallet(null);
		setModalVisible(false);
	};


	// console.log(group) 

	// Render individual wallet item
	const renderWalletItem = ({ item }) => (
		<TouchableOpacity
			className="bg-white rounded-lg shadow-md mb-4 p-4 mx-2"
			// onPress={() => openModal(item)}
		>
			<View className="flex-row items-center">
				<View className="flex-1">
					<Text className="text-lg font-bold text-gray-800">{item.name}</Text>
					<Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
						{item.goal}
					</Text>
				</View>
				<View>
					<Text className="text-base font-semibold text-green-600">{item.total_balance}</Text>
				</View>
			</View>
		</TouchableOpacity>

		
	)

	// Render content based on loading state
	if (loading) {
		return (
			<EnhancedLoader isLoading={true} message='Loading group wallets' />
		)
	}

	return (
		<View className="flex-1 bg-gray-100">
			<StatusBar style="light" />
			<AkibaHeader
				title="Group Wallets"
				message="Update your group wallets..."
				icon="arrow-back"
				color="white"
				handlePress={() => router.back()}
			/>
			<AddNewWalletSection
				groupId={id}
				onRefresh={onRefresh}
				groupMembers={group.members}
				wallets={wallets}
			/>
			<View className="mt-3">
				<FlatList
					data={wallets}
					renderItem={renderWalletItem}
					keyExtractor={(item) => item.id}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={['#9Bd35A', '#689F38']}
						/>
					}
					contentContainerStyle="px-5 pb-5"
					ListEmptyComponent={
						<View className="items-center mt-12">
							<Text className="text-lg text-gray-500">No Wallets Found</Text>
						</View>
					}
				/>
			</View>
			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={closeModal}
			>
				<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
					<View className="bg-white rounded-lg p-6 w-4/5 shadow-lg">
						{selectedWallet && (
							<>
								<Text className="text-xl font-bold text-gray-800 mb-2">
									{selectedWallet.name}
								</Text>
								<Text className="text-gray-600 mb-1">
									Goal: {selectedWallet.goal}
								</Text>
								<Text className="text-gray-600 mb-4">
									Total Balance: {selectedWallet.total_balance}
								</Text>
							</>
						)}
						<Button title="Close" onPress={closeModal} color="#689F38" />
					</View>
				</View>
			</Modal>
		</View>
	)
}

export default GroupWallet;