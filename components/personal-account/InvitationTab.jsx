import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const InvitationTab = ({ activeTab, setActiveTab }) => {
	return (
		<View className="flex flex-row justify-around items-center p-4 bg-white shadow-md">
			<TouchableOpacity
				onPress={() => setActiveTab('invitations')} className={`p-2 ${activeTab === 'invitations' ? 'border-b-4 border-[#111827]' : ''}`}>
				<Text className={`${activeTab === 'invitations' ? 'text-[#028758]' : 'text-gray-500'} text-lg font-semibold`}>
					Group Invitations
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => setActiveTab('joinRequests')} className={`p-2 ${activeTab === 'joinRequests' ? 'border-b-4 border-[#111827]' : ''}`}>
				<Text className={`${activeTab === 'joinRequests' ? 'text-[#028758]' : 'text-gray-500'} text-lg font-semibold`}>
					Available Groups
				</Text>
			</TouchableOpacity>
		</View>
	)
}

export default InvitationTab