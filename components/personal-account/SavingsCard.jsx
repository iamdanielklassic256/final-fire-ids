import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const SavingsCard = ({ title, amount, icon, backgroundColor }) => {
	return (
		<View style={{
			backgroundColor: backgroundColor || '#fff',
			padding: 16,
			borderRadius: 12,
			marginBottom: 16,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		}}>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<View>
					<Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>{title}</Text>
					<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
						UGX {amount.toLocaleString()}
					</Text>
				</View>
				<Ionicons name={icon} size={24} color="#00E394" />
			</View>
		</View>
	)
}

export default SavingsCard