import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { group_wallet_url, all_savings_groups_by_member_id, member_group_wallet_type_url } from '../../api/api'

const AddWallet = () => {
	const [wallet, setWallet] = useState({
		groupId: '',
		walletTypeId: '',
		goal: '',
		description: '',
		total_balance: '0'
	})
	const [groups, setGroups] = useState([])
	const [walletTypes, setWalletTypes] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		fetchGroups()
		fetchWalletTypes()
	}, [])

	const fetchGroups = async () => {
		try {
			const memberData = await AsyncStorage.getItem('member')
			if (memberData) {
				const memberId = JSON.parse(memberData).id
				const response = await fetch(`${all_savings_groups_by_member_id}/${memberId}`)
				if (response.ok) {
					const data = await response.json()
					setGroups(data)
				}
			}
		} catch (error) {
			console.error('Error fetching groups:', error)
		}
	}

	const fetchWalletTypes = async () => {
		try {
			const memberData = await AsyncStorage.getItem('member')
			if (memberData) {
				const memberId = JSON.parse(memberData).id
				const response = await fetch(`${member_group_wallet_type_url}/${memberId}`)
				if (response.ok) {
					const data = await response.json()
					setWalletTypes(data.data || [])
				}
			}
		} catch (error) {
			console.error('Error fetching wallet types:', error)
		}
	}

	const handleInputChange = (name, value) => {
		setWallet(prevWallet => ({
			...prevWallet,
			[name]: value
		}))
	}

	const handleSubmit = async () => {
		if (!wallet.groupId || !wallet.walletTypeId || !wallet.goal || !wallet.description) {
		  Alert.alert('Error', 'Please fill in all fields')
		  return
		}
	  
		console.log('groupId', wallet.groupId)
		console.log('walletTypeId', wallet.walletTypeId)
		setIsLoading(true)
		console.log('wallet:::::', wallet)
		try {
		  const response = await fetch(group_wallet_url, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(wallet)
		  })
	  
		  const responseData = await response.json()
	  
		  if (response.ok) {
			Alert.alert('Success', 'Wallet created successfully', [
			  { text: 'OK', onPress: () => router.back() }
			])
		  } else {
			// Log the full response for debugging
			console.error('Server response:', responseData)
			throw new Error(responseData.message || 'Failed to create wallet')
		  }
		} catch (error) {
		  console.error('Error creating wallet:', error)
		  
		  // Provide more detailed error information
		  let errorMessage = 'Failed to create wallet. '
		  if (error.message) {
			errorMessage += error.message
		  }
		  if (error.response) {
			errorMessage += ` Status: ${error.response.status}`
		  }
		  
		  Alert.alert('Error', errorMessage + '\n\nPlease check your network connection and try again.')
		} finally {
		  setIsLoading(false)
		}
	  }

	return (
		<ScrollView style={styles.container}>


			<View style={styles.inputContainer}>
				<Text style={styles.label}>Select Group</Text>
				<Picker
					selectedValue={wallet.groupId}
					onValueChange={(itemValue) => handleInputChange('groupId', itemValue)}
					style={styles.picker}
				>
					<Picker.Item label="Select a group" value="" />
					{groups.map(group => (
						<Picker.Item key={group.id} label={group.name} value={group.id} />
					))}
				</Picker>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Select Wallet Type</Text>
				<Picker
					selectedValue={wallet.walletTypeId}
					onValueChange={(itemValue) => handleInputChange('walletTypeId', itemValue)}
					style={styles.picker}
				>
					<Picker.Item label="Select a wallet type" value="" />
					{walletTypes.map(type => (
						<Picker.Item key={type.id} label={type.name} value={type.id} />
					))}
				</Picker>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Goal Amount</Text>
				<TextInput
					style={styles.input}
					value={wallet.goal}
					onChangeText={(text) => handleInputChange('goal', text)}
					placeholder="Enter goal amount"
					keyboardType="numeric"
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Description</Text>
				<TextInput
					style={[styles.input, styles.textArea]}
					value={wallet.description}
					onChangeText={(text) => handleInputChange('description', text)}
					placeholder="Enter wallet description"
					multiline
				/>
			</View>

			<TouchableOpacity
				style={styles.button}
				onPress={handleSubmit}
				disabled={isLoading}
			>
				<Text style={styles.buttonText}>
					{isLoading ? 'Creating...' : 'Create Wallet'}
				</Text>
			</TouchableOpacity>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
		fontWeight: '600',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		padding: 10,
		fontSize: 16,
		backgroundColor: '#fff',
	},
	textArea: {
		height: 100,
		textAlignVertical: 'top',
	},
	picker: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		backgroundColor: '#fff',
	},
	button: {
		backgroundColor: '#007AFF',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
})

export default AddWallet