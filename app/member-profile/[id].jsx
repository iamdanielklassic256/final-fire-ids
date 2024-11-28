import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import AkibaHeader from '../../components/AkibaHeader';
import EnhancedLoader from '../../utils/EnhancedLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { saving_group_url } from '../../api/api';
import GroupMemberSection from '../../components/member-profile/GroupMemberSection';



const MemberProfile = () => {
	const { id } = useLocalSearchParams();
	const [loading, setLoading] = useState(true);
	const [member, setMember] = useState(null);

	const [group, setGroup] = useState({})

	useEffect(() => {
		const fetchGroupDetails = async () => {
			try {
				const memberData = await AsyncStorage.getItem("member");
				if (memberData) {
					setMember(JSON.parse(memberData));
				}

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

	// console.log(group)


	const handleAddNewGroupMember = async () => {
		console.log('adding')
	}



	return (
		<View className="flex-1 bg-gray-50">
			<StatusBar style="light" />
			<AkibaHeader
				title="Group Members Profile"
				message="View your group member profile"
				icon="arrow-back"
				color="white"
				handlePress={() => router.back()}
			/>
			{loading ? (
				<EnhancedLoader isLoading={loading} message='Loading group details...' />
			) : (
				<GroupMemberSection
					groupId={id}
					groupMembers={group.members}
					onAddMember={handleAddNewGroupMember}
				/>
			)}
		</View>
	)
}

export default MemberProfile