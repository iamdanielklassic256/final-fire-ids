import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import AkibaHeader from '../../components/AkibaHeader';
import EnhancedLoader from '../../utils/EnhancedLoader';
import { router, useLocalSearchParams } from 'expo-router';
import MemberSavingSection from '../../components/saving/MemberSavingSection';

const GroupSaving = () => {
	const { id } = useLocalSearchParams();

  return (
	<View className="flex-1 bg-gray-100">
		<StatusBar style="light" />
		<AkibaHeader
				title="Group Savings"
				message="Update your group saving information"
				icon="arrow-back"
				color="white"
				handlePress={() => router.back()}
			/>
	  	<MemberSavingSection groupId={id}/>
	</View>
  )
}

export default GroupSaving