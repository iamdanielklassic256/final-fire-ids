import React from 'react'
import { Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import TabBar from './TabBar';

const GroupHeader = ({ group, activeTab, setActiveTab }) => {

	const getMemberCount = (group) => {
		return group.members ? group.members.length : 0;
	};
	return (
		<>
			<LinearGradient
				colors={['#250048', '#250048']}
				className="rounded-b-xl shadow-md p-6 mb-6"
			>
				<Text className="text-gray-200 mb-2">Group Members: {getMemberCount(group)}</Text>
				<Text className="text-gray-200 mb-2">Created: {new Date(group.createdAt).toLocaleDateString()}</Text>
				<Text className="text-gray-200 mb-2">Saving Cycle: {group.start_date} to {group.end_date}</Text>
				<Text className="text-gray-200 capitalize">Contribution Frequency: {group.contribution_frequency}</Text>
			</LinearGradient>

			<TabBar activeTab={activeTab} onTabPress={setActiveTab} />
		</>
	)
}

export default GroupHeader