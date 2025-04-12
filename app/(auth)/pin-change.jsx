import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	ScrollView
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { USER_AUTH_PIN_CHANGE_API } from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const PinChangeScreen = () => {
	const [currentPin, setCurrentPin] = useState('');
	const [newPin, setNewPin] = useState('');
	const [confirmPin, setConfirmPin] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [user, setUser] = useState(null);
	const [loadingUser, setLoadingUser] = useState(true);
	const [showCurrentPin, setShowCurrentPin] = useState(false);
	const [showNewPin, setShowNewPin] = useState(false);
	const [showConfirmPin, setShowConfirmPin] = useState(false);

	// Get theme from context
	const { theme } = useContext(ThemeContext);
	const darkMode = theme === 'dark';

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
				const statusCode = error.response.status;
				const errorData = error.response.data;

				if (statusCode === 400) {
					setError(errorData.message || 'Invalid PIN information provided');
				} else if (statusCode === 401) {
					setError('Your session has expired. Please log in again.');
				} else if (statusCode === 403) {
					setError('You do not have permission to change this PIN');
				} else if (statusCode === 404) {
					setError('User account not found');
				} else if (statusCode === 409) {
					setError('Current PIN is incorrect');
				} else {
					setError(errorData.message || 'Server error. Please try again later.');
				}
			} else if (error.request) {
				setError('No response from server. Please check your internet connection.');
			} else {
				setError('Failed to send request. Please try again.');
			}
		} finally {
			setLoading(false);
		}
	};

	// Simple animation effect for PIN dots
	const renderPinDots = (pin) => {
		return (
			<View className="flex-row justify-center space-x-3 mt-2">
				{[...Array(4)].map((_, index) => (
					<View
						key={index}
						className={`h-3 w-3 rounded-full ${
							index < pin.length ? 'bg-[#f27c22]' : darkMode ? 'bg-gray-600' : 'bg-gray-200'
						} ${index < pin.length ? 'scale-110' : 'scale-100'}`}
					/>
				))}
			</View>
		);
	};

	if (loadingUser) {
		return (
			<SafeAreaView className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#f27c22" />
					<Text className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
						Loading your account...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	const handleGoBack = () => {
		router.back();
	};

	// Theme-based styles
	const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
	const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
	const subTextColor = darkMode ? 'text-gray-300' : 'text-gray-600';
	const inputBgColor = darkMode ? 'bg-gray-800' : 'bg-gray-50';
	const inputBorderColor = darkMode ? 'border-gray-700' : 'border-gray-300';
	const headerGradient = darkMode ? 'bg-gray-800' : 'bg-indigo-50';
	const accentCorner = darkMode ? 'bg-[#d26418]' : 'bg-[#f27c22]';

	return (
		<SafeAreaView className={`flex-1 ${bgColor}`}>
			{/* Background gradients */}
			<View className={`absolute top-0 left-0 right-0 h-64 ${headerGradient} rounded-b-3xl`} />
			<View className={`absolute top-0 right-0 w-48 h-48 ${accentCorner} rounded-bl-full opacity-70`} />

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="flex-1"
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ flexGrow: 1 }}
					className="px-6"
				>
					<TouchableOpacity
						onPress={handleGoBack}
						className="mt-4"
					>
						<View className="flex-row items-center">
							<Ionicons name="arrow-back" size={24} color="#f27c22" />
						</View>
					</TouchableOpacity>
					<View className="mt-12 mb-4">
						<View className="flex-row items-center">
							<Ionicons name="shield-checkmark" size={32} color="#f27c22" />
							<Text className={`text-3xl font-bold ${textColor} ml-3`}>Security Center</Text>
						</View>
						<Text className={`text-lg ${subTextColor} mt-2`}>Update your PIN for secure access</Text>
					</View>

					{/* Error & Success Messages */}
					{error ? (
						<View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
							<View className="flex-row items-center">
								<Ionicons name="alert-circle" size={20} color="#dc2626" />
								<Text className="text-red-700 font-medium ml-2">{error}</Text>
							</View>
						</View>
					) : null}

					{success ? (
						<View className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
							<View className="flex-row items-center">
								<Ionicons name="checkmark-circle" size={20} color="#059669" />
								<Text className="text-green-700 font-medium ml-2">{success}</Text>
							</View>
						</View>
					) : null}

					<View className="mt-6">
						{/* Current PIN Field */}
						<View className="mb-6">
							<Text className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Current PIN</Text>
							<View className={`flex-row items-center border ${inputBorderColor} ${inputBgColor} rounded-xl overflow-hidden`}>
								<TextInput
									className={`flex-1 px-4 py-3 ${textColor}`}
									value={currentPin}
									onChangeText={setCurrentPin}
									keyboardType="numeric"
									secureTextEntry={!showCurrentPin}
									maxLength={4}
									placeholder="Enter current PIN"
									placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
								/>
								<TouchableOpacity
									className="px-4"
									onPress={() => setShowCurrentPin(!showCurrentPin)}
								>
									<Ionicons
										name={showCurrentPin ? "eye-off-outline" : "eye-outline"}
										size={22}
										color={darkMode ? "#9ca3af" : "#6b7280"}
									/>
								</TouchableOpacity>
							</View>
							{renderPinDots(currentPin)}
						</View>

						{/* New PIN Field */}
						<View className="mb-6">
							<Text className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>New PIN</Text>
							<View className={`flex-row items-center border ${inputBorderColor} ${inputBgColor} rounded-xl overflow-hidden`}>
								<TextInput
									className={`flex-1 px-4 py-3 ${textColor}`}
									value={newPin}
									onChangeText={setNewPin}
									keyboardType="numeric"
									secureTextEntry={!showNewPin}
									maxLength={4}
									placeholder="Enter new PIN"
									placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
								/>
								<TouchableOpacity
									className="px-4"
									onPress={() => setShowNewPin(!showNewPin)}
								>
									<Ionicons
										name={showNewPin ? "eye-off-outline" : "eye-outline"}
										size={22}
										color={darkMode ? "#9ca3af" : "#6b7280"}
									/>
								</TouchableOpacity>
							</View>
							{renderPinDots(newPin)}
						</View>

						{/* Confirm New PIN Field */}
						<View className="mb-8">
							<Text className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Confirm New PIN</Text>
							<View className={`flex-row items-center border ${inputBorderColor} ${inputBgColor} rounded-xl overflow-hidden`}>
								<TextInput
									className={`flex-1 px-4 py-3 ${textColor}`}
									value={confirmPin}
									onChangeText={setConfirmPin}
									keyboardType="numeric"
									secureTextEntry={!showConfirmPin}
									maxLength={4}
									placeholder="Confirm new PIN"
									placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
								/>
								<TouchableOpacity
									className="px-4"
									onPress={() => setShowConfirmPin(!showConfirmPin)}
								>
									<Ionicons
										name={showConfirmPin ? "eye-off-outline" : "eye-outline"}
										size={22}
										color={darkMode ? "#9ca3af" : "#6b7280"}
									/>
								</TouchableOpacity>
							</View>
							{renderPinDots(confirmPin)}
						</View>

						{/* Update PIN Button */}
						<TouchableOpacity
							className={`${loading ? 'bg-indigo-400' : 'bg-[#f27c22]'} py-4 rounded-xl shadow-md flex-row justify-center items-center mb-6`}
							onPress={handleChangePin}
							disabled={loading}
						>
							{loading ? (
								<>
									<ActivityIndicator color="#ffffff" size="small" />
									<Text className="text-white font-semibold ml-2">Updating...</Text>
								</>
							) : (
								<>
									<Ionicons name="shield-checkmark" size={20} color="#ffffff" />
									<Text className="text-white text-center text-lg font-semibold ml-2">Update PIN</Text>
								</>
							)}
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default PinChangeScreen;