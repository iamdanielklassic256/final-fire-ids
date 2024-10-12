import { View, Text } from 'react-native'
import React from 'react'
import EditableInfoItem from './EditableInfoItem'

const SocialCard = ({editMode, editedGroup, handleChange}) => {
	return (
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
	)
}

export default SocialCard