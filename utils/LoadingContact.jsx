import { Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const LoadingContact = () => {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
			<ActivityIndicator size="large" color="#028758" />
			<Text style={{ marginTop: 16, color: '#6B7280' }}>Loading your information...</Text>
		</SafeAreaView>
	)
}

export default LoadingContact