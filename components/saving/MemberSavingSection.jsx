import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { all_members_in_a_group, group_transaction_url, group_wallet_url } from '../../api/api';
import EnhancedLoader from '../../utils/EnhancedLoader';
import axios from 'axios';

const MemberSavingSection = ({ groupId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [members, setMembers] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [contributionAmount, setContributionAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Wallet Details
    const fetchWalletDetails = useCallback(async () => {
        try {
            const response = await axios.get(`${group_wallet_url}/group/${groupId}`);
            setWallets(response?.data.data || []);
        } catch (error) {
            console.error('Error fetching group wallet details:', error);
            Alert.alert('Error', 'Failed to load group wallet details');
        }
    }, [groupId]);

    // Fetch Group Members
    const fetchAllGroupMembers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${all_members_in_a_group}/${groupId}`);
            if (response.ok) {
                const data = await response.json();
                setMembers(data?.members || []);
            } else {
                throw new Error('Failed to fetch group members');
            }
        } catch (error) {
            console.error('Error fetching group members:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    // Fetch Data on Component Mount
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchAllGroupMembers(), fetchWalletDetails()]);
        };
        fetchData();
    }, [fetchAllGroupMembers, fetchWalletDetails]);

    // Format Contribution Amount
    const formattedContributionAmount = useMemo(() => {
        return contributionAmount.replace(/[^0-9.]/g, '');
    }, [contributionAmount]);

    // Handle Contribution Submission
    const handleContribution = async () => {
        if (!selectedMember) {
            Alert.alert('Error', 'Please select a member');
            return;
        }

        if (!selectedWallet) {
            Alert.alert('Error', 'Please select a wallet');
            return;
        }

        const amount = parseFloat(formattedContributionAmount);
        if (!formattedContributionAmount || isNaN(amount) || amount <= 0) {
            Alert.alert('Error', 'Please enter a valid contribution amount');
            return;
        }

        if (isSubmitting) return;

        const transactionPayload = {
            memberId: selectedMember.id,
            walletId: selectedWallet.id,
            amount: amount,
        };

        try {
            setIsSubmitting(true);
            const response = await axios.post(group_transaction_url, transactionPayload);

            if (response.data) {
                Alert.alert('Success', `Contribution of UGX ${formattedContributionAmount} submitted successfully`);
                setWallets(prevWallets =>
                    prevWallets.map(wallet =>
                        wallet.id === selectedWallet.id
                            ? { ...wallet, total_balance: (parseFloat(wallet.total_balance) + amount).toString() }
                            : wallet
                    )
                );
                setSelectedWallet(null);
                setSelectedMember(null);
                setContributionAmount('');
            }
        } catch (error) {
            console.error('Contribution error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to submit contribution');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render Member Item
    const renderMemberItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white px-4 py-3 mt-2 border-b border-gray-200 rounded-lg"
            onPress={() => setSelectedMember(item)}
        >
            <Text className="text-base font-bold text-black">{item.name}</Text>
            <Text className="text-gray-600">{item.contact_one}</Text>
        </TouchableOpacity>
    );

    // Wallet Modal
    const WalletsModal = () => (
        <Modal
            visible={!!selectedMember}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setSelectedMember(null)}
        >
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 p-5">
                    <Text className="text-2xl font-bold text-center mb-5">Group Wallets</Text>
                    {wallets.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-gray-600 text-base">No wallets found</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={wallets}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="bg-gray-100 rounded-lg p-4 mb-4"
                                    onPress={() => setSelectedWallet(item)}
                                >
                                    <Text className="text-lg font-bold text-black mb-2">{item.name}</Text>
                                    <Text className="text-base text-gray-700 mb-1">{item.description}</Text>
                                    <View className="flex-row justify-between items-center mt-2">
                                        <Text className="text-base font-semibold text-gray-600">Goal:</Text>
                                        <Text className="text-base text-gray-800">{item.goal}</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center mt-1">
                                        <Text className="text-base font-semibold text-gray-600">Total Balance:</Text>
                                        <Text className="text-base text-green-600 font-bold">
                                            UGX {parseInt(item.total_balance).toLocaleString()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                    <TouchableOpacity
                        className="bg-blue-500 p-4 rounded-lg mt-5"
                        onPress={() => setSelectedMember(null)}
                    >
                        <Text className="text-white text-center text-base font-bold">Close</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );

    // Contribution Modal
    const ContributeModal = () => (
        <Modal
            visible={!!selectedWallet}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                setSelectedWallet(null);
                setContributionAmount('');
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center items-center bg-black/50"
            >
                <View className="bg-white rounded-lg p-6 w-11/12">
                    <Text className="text-2xl font-bold text-center mb-4">
                        Contribute to {selectedWallet?.name}
                    </Text>
                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-gray-700">Member: {selectedMember?.name}</Text>
                    </View>
                    <TextInput
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                        placeholder="Enter Contribution Amount"
                        keyboardType="numeric"
                        value={contributionAmount}
                        onChangeText={text => setContributionAmount(text.replace(/[^0-9.]/g, ''))}
                    />
                    <View className="flex-row justify-between">
                        <TouchableOpacity
                            className="bg-gray-300 p-3 rounded-lg w-5/12"
                            onPress={() => {
                                setSelectedWallet(null);
                                setContributionAmount('');
                            }}
                        >
                            <Text className="text-black text-center font-bold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-blue-500 p-3 rounded-lg w-5/12"
                            onPress={handleContribution}
                            disabled={isSubmitting}
                        >
                            <Text className="text-white text-center font-bold">
                                {isSubmitting ? 'Submitting...' : 'Contribute'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );

    // Loader and Error State
    if (loading) {
        return <EnhancedLoader isLoading={loading} message="Loading group members..." />;
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-500 text-base">{error}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100 mt-4 mx-2 ">
            <FlatList
                data={members}
                renderItem={renderMemberItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                    <Text className="text-center mt-12 text-base text-gray-600">No members found</Text>
                }
            />
            <WalletsModal />
            <ContributeModal />
        </View>
    );
};

export default MemberSavingSection;
