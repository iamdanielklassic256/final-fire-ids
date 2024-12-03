import { View, Text } from 'react-native'
import React from 'react'
import SingleGroupSection from '../group-account/SingleGroupSection'

const MainGroupDashboard = ({ group }) => {
	return (
		<View className="p-0">
			<SingleGroupSection groupId={group.id} />
		</View>
	)
}

export default MainGroupDashboard