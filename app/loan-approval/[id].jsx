import { View, Text, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar'
import AkibaHeader from '../../components/AkibaHeader'
import { router, useLocalSearchParams } from 'expo-router'
import GroupLoans from '../../components/loans/GroupLoans'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saving_group_url } from '../../api/api';
import axios from 'axios';
import EnhancedLoader from '../../utils/EnhancedLoader'

const LoanApprovalScreen = () => {
	const { id } = useLocalSearchParams();

	const [group, setGroup] = useState({})
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const fetchGroupDetails = async () => {
			try {

				setLoading(true);
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

	if (loading) {
		<EnhancedLoader isLoading={loading} message='Loading loans...' />
	  }

	return (
		<View className="flex-1 bg-gray-50">
			<StatusBar style="light" />
			<AkibaHeader
				title="Group Loan Approval"
				message="approve loan for members"
				icon="arrow-back"
				color="white"
				handlePress={() => router.back()}
			/>
			<GroupLoans groupId={id} group={group}/>
		</View>
	)
}

export default LoanApprovalScreen