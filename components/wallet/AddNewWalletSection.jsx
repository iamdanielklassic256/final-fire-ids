import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';
import axios from 'axios';
import { UserPlus, X, RefreshCw } from 'lucide-react-native';
import { group_wallet_url } from '../../api/api';

const AddNewWalletSection = ({ groupId, onRefresh, wallets }) => {
	const [isWalletLimitModalVisible, setIsWalletLimitModalVisible] = useState(false);
	const [newWalletModal, setNewWalletModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedWallets, setSelectedWallets] = useState([]);
	const [customWallet, setCustomWallet] = useState({
		name: '',
		goal: '',
		description: ''
	});

	console.log(wallets)

	// Predefined wallet types
	const predefinedWalletTypes = [
		'Insurance Fund',
		'Education Fund',
		'Group Business Fund',
		'Celebration Fund',
		'Technology Fund'
	];

	const handleAddNewWallet = async () => {
		if (selectedWallets.length === 0 && !customWallet.name) {
			Alert.alert('Error', 'Please select at least one wallet or create a custom wallet');
			return;
		}

		setLoading(true);
		try {
			// Prepare payload
			const payload = {
				groupId,
				predefinedWallets: selectedWallets,
				customWallets: customWallet.name ? [customWallet] : []
			};

			// Make API call to create wallets
			await axios.post(`${group_wallet_url}/create-multiple-wallets`, payload);

			// Reset state and close modal
			setSelectedWallets([]);
			setCustomWallet({ name: '', goal: '', description: '' });
			setNewWalletModal(false);

			// Trigger refresh of wallets
			onRefresh();

			Alert.alert('Success', 'Wallets created successfully');
		} catch (error) {
			console.error('Error creating wallets:', error);
			Alert.alert('Error', 'Failed to create wallets');
		} finally {
			setLoading(false);
		}
	};

	const toggleWalletSelection = (walletType) => {
		setSelectedWallets((prev) =>
			prev.includes(walletType)
				? prev.filter((w) => w !== walletType)
				: [...prev, walletType]
		);
	};

	// Filter predefined wallets to exclude existing ones
	const availablePredefinedWallets = predefinedWalletTypes.filter(
		(walletType) => !wallets.some((wallet) => wallet.name === walletType)
	);


	return (
		<View>
			<View className="flex-row justify-between items-center p-4 bg-[#111827] mx-4 mt-2 rounded-lg border-b border-gray-200">
				<Text className="text-lg font-bold text-white">Group Wallets</Text>

				<View className="flex-row items-center">
					<TouchableOpacity
						className="p-2 mr-2"
						onPress={onRefresh}
					>
						<RefreshCw color="white" size={24} />
					</TouchableOpacity>

					<TouchableOpacity
						className="p-2"
						onPress={() => setNewWalletModal(true)}
					>
						<UserPlus color="green" size={24} />
					</TouchableOpacity>
				</View>
			</View>

			{/* New Wallet Modal */}
			<Modal
				visible={newWalletModal}
				transparent={false}
				animationType="slide"
				onRequestClose={() => setNewWalletModal(false)}
			>
				<View className="flex-1 bg-white">
					{/* Modal Header */}
					<View className="flex-row justify-between items-center p-4 bg-[#111827]">
						<Text className="text-lg font-bold text-white">Add New Wallet</Text>
						<TouchableOpacity onPress={() => setNewWalletModal(false)}>
							<X color="red" size={24} />
						</TouchableOpacity>
					</View>

					{/* Predefined Wallets Selection */}
					<View className="p-4">
						<Text className="text-lg font-bold mb-4">Select Predefined Wallets</Text>
						<View className="flex-row flex-wrap">
							{availablePredefinedWallets.map((walletType) => (
								<TouchableOpacity
									key={walletType}
									className={`
                  m-1 p-2 rounded-lg border 
                  ${selectedWallets.includes(walletType)
											? 'bg-green-500 border-green-500'
											: 'bg-white border-gray-300'}
                `}
									onPress={() => toggleWalletSelection(walletType)}
								>
									<Text className={`
                  ${selectedWallets.includes(walletType)
											? 'text-white'
											: 'text-gray-700'}
                `}>
										{walletType}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>

					{/* Custom Wallet Creation */}
					<View className="p-4">
						<Text className="text-lg font-bold mb-4">Or Create a Custom Wallet</Text>
						<View className="mb-4">
							<Text className="mb-2">Wallet Name</Text>
							<View className="border rounded-lg p-2">
								<TextInput
									placeholder="e.g. Land Fund"
									value={customWallet.name}
									onChangeText={(value) => setCustomWallet((prev) => ({ ...prev, name: value }))}
									className="w-full"
								/>
							</View>
						</View>
						<View className="mb-4">
							<Text className="mb-2">Goal</Text>
							<View className="border rounded-lg p-2">
								<TextInput
									placeholder="e.g. Save for new land"
									value={customWallet.goal}
									onChangeText={(value) => setCustomWallet((prev) => ({ ...prev, goal: value }))}
									className="w-full"
								/>
							</View>
						</View>
						<View className="mb-4">
							<Text className="mb-2">Description</Text>
							<View className="border rounded-lg p-2">
								<TextInput
									placeholder="Additional details"
									value={customWallet.description}
									onChangeText={(value) => setCustomWallet((prev) => ({ ...prev, description: value }))}
									className="w-full"
								/>
							</View>
						</View>
					</View>

					{/* Add Wallet Button */}
					<TouchableOpacity
						className={`
              rounded-lg p-3 m-4 
              ${(selectedWallets.length > 0 || customWallet.name)
								? 'bg-[#028758]'
								: 'bg-gray-400'}
            `}
						onPress={handleAddNewWallet}
						disabled={loading || (selectedWallets.length === 0 && !customWallet.name)}
					>
						{loading ? (
							<Text className="text-white text-center">Adding...</Text>
						) : (
							<Text className="text-white text-center">Add Wallet</Text>
						)}
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	);
};

export default AddNewWalletSection;
