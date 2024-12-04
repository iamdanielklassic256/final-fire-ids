import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import AkibaHeader from '../../components/AkibaHeader'
import { router, useLocalSearchParams } from 'expo-router'
import AccountScreen from '../(tabs)/account'

const LoanRequestScreen = () => {
	const { id } = useLocalSearchParams();

	return (
		<View className="flex-1 bg-gray-50">
			<StatusBar style="light" />
			<AkibaHeader
				title="Group Member Transactions"
				message="Update your personal transaction"
				icon="arrow-back"
				color="white"
				handlePress={() => router.back()}
			/>
			<AccountScreen />
		</View>
	)
}

export default LoanRequestScreen