import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AkibaHeader from '../../components/AkibaHeader';
import EnhancedLoader from '../../utils/EnhancedLoader';
import GroupJoinRequests from '../../components/savings/GroupJoinRequests'
import { saving_group_url } from '../../api/api';

const GroupJoinRequestScreen = () => {
	const { id } = useLocalSearchParams();
	const [group, setGroup] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchSingleGroup();
	}, [id]);

	const fetchSingleGroup = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${saving_group_url}/${id}`);
			if (response.ok) {
				const data = await response.json();
				setGroup(data?.data);
			} else {
				setError('Failed to fetch group details');
			}
		} catch (error) {
			console.error('Error fetching group details:', error);
			setError('An error occurred while fetching group details');
		} finally {
			setLoading(false);
		}
	};

	// If loading, return the loader
	if (loading) {
		return <EnhancedLoader isLoading={loading} message='Loading group request...' />;
	}

	// Optional: Handle error state
	if (error) {
		return (
			<View className="flex-1 justify-center items-center">
				<Text className="text-red-500">{error}</Text>
			</View>
		);
	}

	console.log('Single Meeting Id', group)

	return (
		<View className="flex-1 bg-gray-50">
			<StatusBar style="light" />
			<AkibaHeader
				title="Group Join Request"
				message="Update your group join request"
				icon="arrow-back"
				color="white"
				handlePress={() => router.back()}
			/>
			{/* <GroupInvitation groupId={id}/> */}
			<GroupJoinRequests groupId={id} group={group} />
		</View>
  )
}

export default GroupJoinRequestScreen