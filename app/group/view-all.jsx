import { View, Text, Alert, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import AkibaHeader from '../../components/AkibaHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { all_savings_groups_by_member_id } from '../../api/api';
import EnhancedLoader from '../../utils/EnhancedLoader';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const ViewAllGroups = () => {
	const [member, setMember] = useState(null);
	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMemberData = async () => {
			try {
				const memberData = await AsyncStorage.getItem('member');
				if (memberData) {
					const memberInfo = JSON.parse(memberData);
					setMember(memberInfo);
					fetchGroups(memberInfo.id);
				} else {
					throw new Error('No member data found.');
				}
			} catch (error) {
				console.error('Error fetching member data:', error);
				Alert.alert('Error', 'Unable to load your profile. Please try again.');
				setLoading(false);
			}
		};

		fetchMemberData();
	}, []);

	const fetchGroups = async (memberId) => {
		try {
			const response = await fetch(`${all_savings_groups_by_member_id}/${memberId}`);
			if (!response.ok) {
				throw new Error('Failed to fetch groups');
			}
			const data = await response.json();
			setGroups(data);
		} catch (error) {
			console.error('Error fetching groups:', error);
			Alert.alert('Error', 'Unable to load saving groups. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	const handleGoBack = () => {
		router.back()

	}

	const renderGroup = ({ item }) => (
		<View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ddd' }}>
			<Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
			<Text>{item.description}</Text>
		</View>
	);

	if (loading) {
		return (
			<EnhancedLoader
				isLoading={true}
				message='Loading your saving groups...'
			/>
		);
	}

	return (
		<View style={{ flex: 1 }} className="bg-gray-500">
			<StatusBar style="light" />
			<AkibaHeader
				title="Saving Groups"
				message="View all your saving groups"
				color="white"
				handlePress={handleGoBack}
				icon="arrow-back"
			/>
			{groups.length > 0 ? (
				<FlatList
					data={groups}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderGroup}
					contentContainerStyle={{ padding: 16 }}
				/>
			) : (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text className="text-white text-lg">No saving groups found.</Text>
				</View>
			)}
		</View>
	);
};

export default ViewAllGroups;
