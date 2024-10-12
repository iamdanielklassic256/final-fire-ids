import { View, Text } from 'react-native'
import React from 'react'
import EditableInfoItem from './EditableInfoItem'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const FinancialCard = ({editedGroup, editMode, handleChange}) => {
	return (
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
	)
}

export default FinancialCard