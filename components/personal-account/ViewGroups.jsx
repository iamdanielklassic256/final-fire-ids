import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ViewGroups = () => {

	const handleFetchAllMyGroups = () => {
		router.push('/group/view-all');
	};

	return (
		<TouchableOpacity
			className="w-[48%] bg-white rounded-xl shadow-md p-4 items-center"
			onPress={handleFetchAllMyGroups}
		>
			<Icon name="account-group" size={40} color="#028758" />
			<Text className="mt-2 font-semibold text-center">View My Groups</Text>
		</TouchableOpacity>
	)
}

export default ViewGroups