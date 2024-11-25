import { View, Text } from 'react-native'
import React from 'react'
import SavingsCard from './SavingsCard'

const SavingOverview = ({ savingsData }) => {
	return (
		<View>
			<SavingsCard
				title="Total Savings"
				amount={savingsData.totalSavings}
				icon="wallet-outline"
				backgroundColor="#f0fff4"
			/>
		</View>
	)
}

export default SavingOverview