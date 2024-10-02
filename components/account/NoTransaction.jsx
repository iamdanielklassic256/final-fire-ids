import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const NoTransaction = () => {
	return (
		<View>
			<Text style={styles.noDataText}>No transactions found.</Text>
		</View>
	)
}


const styles = StyleSheet.create({
	noDataText: {
		textAlign: 'center',
		marginTop: 20,
		fontStyle: 'italic',
		color: '#888',
	},
});

export default NoTransaction