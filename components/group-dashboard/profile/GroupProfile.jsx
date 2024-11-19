import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { router } from 'expo-router'

const GroupProfile = ({ group }) => {
	const [activeSection, setActiveSection] = useState(null)

	const ProfileSection = ({ title, onPress, children }) => (
		<View className="mb-4 bg-white rounded-lg shadow-md">
			<TouchableOpacity
				className="flex-row justify-between items-center p-4 border-b border-gray-200"
				onPress={onPress}
			>
				<Text className="text-lg font-semibold">{title}</Text>
				<ChevronRight color="gray" size={24} />
			</TouchableOpacity>

		</View>
	)

	return (
		<ScrollView className="flex-1 bg-gray-100 p-4">
			<ProfileSection
				title="Group Profile"
				onPress={() =>router.push(`/group-profile/${group.id}`)}
			>
			</ProfileSection>

			<ProfileSection
				title="Cycle Schedule"
				onPress={() => { }}
			>
			</ProfileSection>
			<ProfileSection
				title="Members Profile"
				onPress={() => { }}
			>
			</ProfileSection>

			<ProfileSection
				title="Member Passbooks"
				onPress={() => { }}
			>

			</ProfileSection>

			<ProfileSection
				title="Elect Officers"
				onPress={() => { }}
			>
			</ProfileSection>

			<ProfileSection
				title="Group History"
				onPress={() => { }}
			>
			</ProfileSection>
		</ScrollView>
	)
}

export default GroupProfile