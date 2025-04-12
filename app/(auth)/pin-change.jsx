import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { USER_AUTH_PIN_CHANGE_API } from '../../api/api';

const PinChangeScreen = () => {
	const [currentPin, setCurrentPin] = useState('');
	const [newPin, setNewPin] = useState('');
	const [confirmPin, setConfirmPin] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [user, setUser] = useState(null);
	const [loadingUser, setLoadingUser] = useState(true);
	
	useEffect(() => {
		const getUserData = async () => {
			try {
				const userData = await AsyncStorage.getItem('userData');
				if (userData) {
					setUser(JSON.parse(userData));
				}
			} catch (error) {
				console.error('Failed to load user data:', error);
				setError('Failed to load user data. Please restart the app.');
			} finally {
				setLoadingUser(false);
			}
		};
	
		getUserData();
	}, []);

	const userId = user?.id;

	const handleChangePin = async () => {
		// Reset states
		setError('');
		setSuccess('');

		// Validation
		if (!userId) {
			setError('User information not found. Please log in again.');
			return;
		}

		if (currentPin.length !== 4) {
			setError('Current PIN must be exactly 4 digits');
			return;
		}

		if (newPin.length !== 4) {
			setError('New PIN must be exactly 4 digits');
			return;
		}

		if (newPin !== confirmPin) {
			setError('New PINs do not match');
			return;
		}

		if (currentPin === newPin) {
			setError('New PIN must be different from current PIN');
			return;
		}

		try {
			setLoading(true);
			const token = await AsyncStorage.getItem('authToken');
			if (!token) {
				throw new Error('No access token found');
			}

			const response = await axios.post(
				USER_AUTH_PIN_CHANGE_API,
				{
					userId,
					currentPin,
					newPin,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);

			setSuccess(response.data.message || 'PIN changed successfully');
			setCurrentPin('');
			setNewPin('');
			setConfirmPin('');
		} catch (error) {
			console.error('Change PIN error:', error);
			
			// Handle different types of errors
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				const statusCode = error.response.status;
				const errorData = error.response.data;
				
				if (statusCode === 400) {
					// Bad request - usually validation errors
					setError(errorData.message || 'Invalid PIN information provided');
				} else if (statusCode === 401) {
					// Unauthorized
					setError('Your session has expired. Please log in again.');
					// You might want to redirect to login screen here
				} else if (statusCode === 403) {
					// Forbidden
					setError('You do not have permission to change this PIN');
				} else if (statusCode === 404) {
					// Not found
					setError('User account not found');
				} else if (statusCode === 409) {
					// Conflict
					setError('Current PIN is incorrect');
				} else {
					// Other server errors
					setError(errorData.message || 'Server error. Please try again later.');
				}
			} else if (error.request) {
				// The request was made but no response was received
				setError('No response from server. Please check your internet connection.');
			} else {
				// Something happened in setting up the request
				setError('Failed to send request. Please try again.');
			}
		} finally {
			setLoading(false);
		}
	};

	const renderPinDots = (pin) => {
		return (
			<View style={styles.pinDotsContainer}>
				{[...Array(4)].map((_, index) => (
					<View
						key={index}
						style={[
							styles.pinDot,
							index < pin.length ? styles.pinDotFilled : {}
						]}
					/>
				))}
			</View>
		);
	};

	if (loadingUser) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#3b82f6" />
					<Text style={styles.loadingText}>Loading user data...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardAvoid}
			>
				<View style={styles.container}>
					<Text style={styles.title}>Change PIN</Text>
					<Text style={styles.subtitle}>Update your secure 4-digit PIN</Text>

					{/* Error message display with improved visibility */}
					{error ? (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					) : null}

					{/* Success message display with improved visibility */}
					{success ? (
						<View style={styles.successContainer}>
							<Text style={styles.successText}>{success}</Text>
						</View>
					) : null}

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Current PIN</Text>
						<TextInput
							style={styles.input}
							value={currentPin}
							onChangeText={setCurrentPin}
							keyboardType="numeric"
							secureTextEntry
							maxLength={4}
							placeholder="Enter current PIN"
						/>
						{renderPinDots(currentPin)}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>New PIN</Text>
						<TextInput
							style={styles.input}
							value={newPin}
							onChangeText={setNewPin}
							keyboardType="numeric"
							secureTextEntry
							maxLength={4}
							placeholder="Enter new PIN"
						/>
						{renderPinDots(newPin)}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Confirm New PIN</Text>
						<TextInput
							style={styles.input}
							value={confirmPin}
							onChangeText={setConfirmPin}
							keyboardType="numeric"
							secureTextEntry
							maxLength={4}
							placeholder="Confirm new PIN"
						/>
						{renderPinDots(confirmPin)}
					</View>

					<TouchableOpacity
						style={[styles.button, loading && styles.buttonDisabled]}
						onPress={handleChangePin}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#fff" size="small" />
						) : (
							<Text style={styles.buttonText}>Update PIN</Text>
						)}
					</TouchableOpacity>

					<Text style={styles.securityNote}>
						For security reasons, choose a PIN that you don't use elsewhere.
					</Text>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#f9fafb',
	},
	keyboardAvoid: {
		flex: 1,
	},
	container: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: '#64748b',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#1e293b',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: '#64748b',
		marginBottom: 32,
	},
	errorContainer: {
		backgroundColor: '#fee2e2',
		borderRadius: 8,
		padding: 12,
		marginBottom: 20,
	},
	successContainer: {
		backgroundColor: '#d1fae5',
		borderRadius: 8,
		padding: 12,
		marginBottom: 20,
	},
	inputGroup: {
		marginBottom: 24,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: '#475569',
		marginBottom: 8,
	},
	input: {
		height: 54,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 12,
		paddingHorizontal: 16,
		fontSize: 16,
		backgroundColor: '#fff',
		color: '#1e293b',
		marginBottom: 12,
	},
	pinDotsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 4,
	},
	pinDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: '#e2e8f0',
		marginHorizontal: 8,
	},
	pinDotFilled: {
		backgroundColor: '#3b82f6',
	},
	button: {
		height: 56,
		backgroundColor: '#3b82f6',
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 16,
		shadowColor: '#3b82f6',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	buttonDisabled: {
		backgroundColor: '#93c5fd',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	errorText: {
		color: '#b91c1c',
		fontSize: 14,
		fontWeight: '500',
		textAlign: 'center',
	},
	successText: {
		color: '#047857',
		fontSize: 14,
		fontWeight: '500',
		textAlign: 'center',
	},
	securityNote: {
		color: '#64748b',
		fontSize: 12,
		textAlign: 'center',
		marginTop: 24,
	},
});

export default PinChangeScreen;