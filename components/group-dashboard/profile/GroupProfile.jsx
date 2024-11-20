import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { router } from 'expo-router'

const GroupProfile = ({ group }) => {

	const ProfileSection = ({ title, onPress, children }) => (
		<View className="mb-4 bg-white rounded-lg shadow-md border-b-2 border-[#028758]">
			<TouchableOpacity
				className="flex-row justify-between   items-center p-4 "
				onPress={onPress}
			>
				<Text className="text-lg font-bold">{title}</Text>
				<ChevronRight color="#028758" size={24} />
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