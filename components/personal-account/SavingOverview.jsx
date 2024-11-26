import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import SavingsCard from './SavingsCard'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account_info_url } from '../../api/api';

const SavingOverview = () => {
	const [member, setMember] = useState(null);
	const [account, setAccount] = useState("");
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchMemberData = async () => {
			try {
				const memberData = await AsyncStorage.getItem("member");
				if (memberData) {
					const memberInfo = JSON.parse(memberData);
					setMember(memberInfo);
				}
			} catch (error) {
				console.error("Error fetching member data:", error);
				Alert.alert("Error", "Unable to load your profile. Please try again.");
			}
		};

		fetchMemberData();
	}, []);

	useEffect(() => {
		if (member && member.id) {
			fetchAccountData();
		}
	}, [member]);


	const fetchAccountData = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${account_info_url}/${member.id}`);
			if (response.status === 200) {
				const data = await response.json();
				setAccount(data);
			}
		} catch (error) {
			setError('Failed to fetch account data. Please try again later.');
			console.error('Error fetching account data:', error);
		} finally {
			setIsLoading(false);
		}
	};



	return (
		<View>
			<SavingsCard
				title="Total Savings"
				amount={account[0]?.account_balance}
				icon="wallet-outline"
				backgroundColor="#f0fff4"
			/>
		</View>
	)
}

export default SavingOverview