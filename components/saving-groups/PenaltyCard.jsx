import { View, Text } from 'react-native'
import React from 'react'
import EditableInfoItem from './EditableInfoItem'

const PenaltyCard = ({editMode, editedGroup, handleChange}) => {
	return (
		<View className="bg-white rounded-xl shadow-md p-6 mb-6">
			<Text className="text-xl font-semibold text-purple-800 mb-4">Penalties</Text>
			<EditableInfoItem
				icon="cash-remove"
				label="Saving Delay Fine"
				value={editedGroup.saving_delay_fine}
				isEditing={editMode}
				onChangeText={(value) => handleChange('saving_delay_fine', value)}
			/>
		</View>
	)
}

export default PenaltyCard