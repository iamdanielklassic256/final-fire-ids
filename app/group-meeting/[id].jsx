import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { group_meeting_url, saving_group_url } from '../../api/api';
import { StatusBar } from 'expo-status-bar';
import AkibaHeader from '../../components/AkibaHeader';
import EnhancedLoader from '../../utils/EnhancedLoader';
import MeetingSection from '../../components/meetings/MeetingSection';

const SingleMeeting = () => {
	const { id } = useLocalSearchParams();
	const [meeting, setMeeting] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchSingleMeeting();
	}, [id]);

	const fetchSingleMeeting = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${group_meeting_url}/${id}`);
			if (response.ok) {
				const data = await response.json();
				setMeeting(data);
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
		return <EnhancedLoader isLoading={loading} message='Loading meeting detail' />;
	}

	// Optional: Handle error state
	if (error) {
		return (
			<View className="flex-1 justify-center items-center">
				<Text className="text-red-500">{error}</Text>
			</View>
		);
	}

	console.log('Single Meeting Id', meeting.groupId)

	return (
		<View className="flex-1 bg-gray-50">
			<StatusBar style="light" />
			<AkibaHeader
				title={meeting?.name || 'Meeting Details'}
				message="Update your group meeting"
				icon="arrow-back"
				color="white"
				handlePress={() => router.back()}
			/>
			{meeting && (
				<MeetingSection
					meetingId={id}
					groupId={meeting.groupId}
				/>
			)}
		</View>
	)
}

export default SingleMeeting