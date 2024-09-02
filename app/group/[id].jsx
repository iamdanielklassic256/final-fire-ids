import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { saving_group_url } from '../../api/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';




const SingleGroup = () => {
	const { id } = useLocalSearchParams();
	const [group, setGroup] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [editedGroup, setEditedGroup] = useState(null);
	const [currentUserId, setCurrentUserId] = useState(null);
	const navigation = useNavigation();

	const [currentMember, setCurrentMember] = useState("");

	useEffect(() => {
		const fetchMemberData = async () => {
			try {
				const memberData = await AsyncStorage.getItem("member");
				if (memberData) {
					const member = JSON.parse(memberData);
					setCurrentMember(member);
				}
			} catch (error) {
				console.error("Error fetching member data:", error);
			}
		};

		fetchMemberData();
		fetchGroupDetails();
	}, [id]);



	// useEffect(() => {
	// 	const fetchUserAndGroupDetails = async () => {
	// 		await getCurrentUser();
	// 		await fetchGroupDetails();
	// 	};
	// 	fetchUserAndGroupDetails();
	// }, [id]);

	// const getCurrentUser = async () => {
	// 	try {
	// 		const userId = await AsyncStorage.getItem('userId');
	// 		console.log('Retrieved userId from AsyncStorage:', userId);
	// 		if (userId) {
	// 			setCurrentUserId(userId);
	// 		} else {
	// 			console.log('No userId found in AsyncStorage');
	// 		}
	// 	} catch (error) {
	// 		console.error('Error fetching current user:', error);
	// 	}
	// };

	const fetchGroupDetails = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${saving_group_url}/${id}`);
			if (response.ok) {
				const data = await response.json();
				setGroup(data);
				setEditedGroup(data);
				navigation.setOptions({ headerTitle: data.name });
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

	const handleEdit = () => {
		setEditMode(true);
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			// const token = await AsyncStorage.getItem('userToken');
			const response = await fetch(`${saving_group_url}/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editedGroup),
			});

			if (response.ok) {
				const updatedGroup = await response.json();
				setGroup(updatedGroup);
				setEditMode(false);
				Alert.alert('Success', 'Group details updated successfully');
			} else {
				throw new Error('Failed to update group details');
			}
		} catch (error) {
			console.error('Error updating group details:', error);
			Alert.alert('Error', 'Failed to update group details');
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setEditedGroup(group);
		setEditMode(false);
	};

	const handleChange = (field, value) => {
		setEditedGroup(prev => ({ ...prev, [field]: value }));
	};


	const canEdit = currentMember.id === group?.created_by;
	console.log('canEdit:', canEdit, 'currentUserId:', currentMember.id, 'group?.created_by:', group?.created_by);

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center bg-purple-50">
				<ActivityIndicator size="large" color="#250048" />
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 justify-center items-center bg-purple-50">
				<Text className="text-red-500 text-lg">{error}</Text>
			</View>
		);
	}

	return (
		<ScrollView className="flex-1 bg-purple-50">
			{group ? (
				<View className="p-6">
					<LinearGradient
						colors={['#8b5cf6', '#6b46c1']}
						className="rounded-xl shadow-md p-6 mb-6"
					>
						<Text className="text-2xl font-bold text-white mb-4">{group.name}</Text>
						<Text className="text-gray-200 mb-2">Group ID: {group.id}</Text>
						<Text className="text-gray-200 mb-2">Created: {new Date(group.createdAt).toLocaleDateString()}</Text>
					</LinearGradient>

					<View className="bg-white rounded-xl shadow-md p-6 mb-6">
						<Text className="text-xl font-semibold text-purple-800 mb-4">Financial Details</Text>
						<EditableInfoItem
							icon="currency-usd"
							label="Currency"
							value={editedGroup.group_curency}
							isEditing={editMode}
							onChangeText={(value) => handleChange('group_curency', value)}
						/>
						<EditableInfoItem
							icon="cash-multiple"
							label="Share Value"
							value={editedGroup.share_value}
							isEditing={editMode}
							onChangeText={(value) => handleChange('share_value', value)}
						/>
						<EditableInfoItem
							icon="percent"
							label="Interest Rate"
							value={editedGroup.interate_rate}
							isEditing={editMode}
							onChangeText={(value) => handleChange('interate_rate', value)}
						/>
					</View>

					<View className="bg-white rounded-xl shadow-md p-6 mb-6">
						<Text className="text-xl font-semibold text-purple-800 mb-4">Social Fund</Text>
						<EditableInfoItem
							icon="cash-minus"
							label="Min Contribution"
							value={editedGroup.min_social_fund_contrib}
							isEditing={editMode}
							onChangeText={(value) => handleChange('min_social_fund_contrib', value)}
						/>
						<EditableInfoItem
							icon="cash-plus"
							label="Max Contribution"
							value={editedGroup.max_social_fund_contrib}
							isEditing={editMode}
							onChangeText={(value) => handleChange('max_social_fund_contrib', value)}
						/>
						<EditableInfoItem
							icon="clock-alert"
							label="Delay Time"
							value={editedGroup.social_fund_delay_time}
							isEditing={editMode}
							onChangeText={(value) => handleChange('social_fund_delay_time', value)}
						/>
					</View>

					<View className="bg-white rounded-xl shadow-md p-6 mb-6">
						<Text className="text-xl font-semibold text-purple-800 mb-4">Penalties</Text>
						<EditableInfoItem
							icon="cash-remove"
							label="Saving Delay Fine"
							value={editedGroup.saving_delay_fine}
							isEditing={editMode}
							onChangeText={(value) => handleChange('saving_delay_fine', value)}
						/>
					</View>

					{canEdit && (
						<View className="flex-row justify-around mt-4">
							{editMode ? (
								<>
									<TouchableOpacity onPress={handleSave} className="bg-green-500 px-6 py-2 rounded-full">
										<Text className="text-white font-bold">Save</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={handleCancel} className="bg-red-500 px-6 py-2 rounded-full">
										<Text className="text-white font-bold">Cancel</Text>
									</TouchableOpacity>
								</>
							) : (
								<TouchableOpacity onPress={handleEdit} className="bg-purple-500 px-6 py-2 rounded-full">
									<Text className="text-white font-bold">Edit</Text>
								</TouchableOpacity>
							)}
						</View>
					)}
				</View>
			) : (
				<Text className="text-red-500 text-lg text-center mt-10">No group data available</Text>
			)}
		</ScrollView>
	);
};

const EditableInfoItem = ({ icon, label, value, isEditing, onChangeText }) => (
	<View className="flex-row items-center mb-3">
		<MaterialCommunityIcons name={icon} size={24} color="#6b46c1" className="mr-3" />
		<View className="flex-1">
			<Text className="text-gray-600 font-medium">{label}</Text>
			{isEditing ? (
				<TextInput
					value={value}
					onChangeText={onChangeText}
					className="border-b border-purple-300 py-1"
				/>
			) : (
				<Text className="text-black">{value || 'Not set'}</Text>
			)}
		</View>
	</View>
);

export default SingleGroup;