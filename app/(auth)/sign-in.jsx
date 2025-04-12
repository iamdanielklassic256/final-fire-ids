import {
	View,
	Text,
	Image,
	SafeAreaView,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../assets/logo/logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForgotPasswordModal from '../../components/authenication/ForgotPasswordModal';
import { USER_AUTH_PIN_LOGIN_API } from '../../api/api';
import { router } from 'expo-router';

const LoginScreen = () => {
	const [identifier, setIdentifier] = useState('');
	const [identifierType, setIdentifierType] = useState('email'); // 'email' or 'phone'
	const [pin, setPin] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [showPin, setShowPin] = useState(false);

	useEffect(() => {
		const getSavedIdentifier = async () => {
			try {
				const savedIdentifier = await AsyncStorage.getItem("userIdentifier");
				const savedType = await AsyncStorage.getItem("identifierType");
				
				if (savedIdentifier) setIdentifier(savedIdentifier);
				if (savedType) setIdentifierType(savedType);
			} catch (error) {
				console.error('Error retrieving saved identifier:', error);
			}
		};
		getSavedIdentifier();
	}, []);

	const handleLogin = async () => {
		console.log('handling login');
		
		// Reset previous errors
		setError('');

		// Input validation
		if (!identifier || !pin) {
			setError('Email/Phone and PIN are required');
			return;
		}

		// Email validation if using email
		if (identifierType === 'email') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(identifier)) {
				setError('Please enter a valid email address');
				return;
			}
		}

		// Phone validation if using phone
		if (identifierType === 'phone') {
			// Basic phone validation - adjust as needed for your requirements
			const phoneRegex = /^\d{10,15}$/;
			if (!phoneRegex.test(identifier.replace(/[^0-9]/g, ''))) {
				setError('Please enter a valid phone number');
				return;
			}
		}

		// PIN validation
		if (pin.length === 4) {
			setError('PIN must be between 4 digits');
			return;
		}

		// Start loading
		setIsLoading(true);

		try {
			// Prepare the request body based on identifier type
			const requestBody = {
				pin
			};
			
			if (identifierType === 'email') {
				requestBody.email = identifier;
			} else {
				requestBody.phoneNumber = identifier;
			}

			// Make API call to login
			const response = await fetch(USER_AUTH_PIN_LOGIN_API, {
				method: 'POST',
				headers: {
					'Accept': '*/*',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			});

			const data = await response.json();

			console.log(data);

			// Handle response based on status code
			if (response.status === 201) {
				// Success - store user data
				await AsyncStorage.setItem('userIdentifier', identifier);
				await AsyncStorage.setItem('identifierType', identifierType);
				
				// Store auth token if present
				if (data.accessToken) {
					await AsyncStorage.setItem('authToken', data.accessToken);
				}
				// Store user data if available
				if (data.data) {
					await AsyncStorage.setItem('userData', JSON.stringify(data.data));
				}
				// Clear PIN field for security
				setPin('');
				// Navigate to home screen
				router.push('/dashboard');
			}
			else if (response.status === 406) {
				// Invalid credentials
				setError('Invalid credentials or PIN. Please try again.');
			}
			else {
				// Other errors
				throw new Error(data.message || 'Login failed');
			}
		} catch (error) {
			console.error('Login error:', error);
			setError(error.message || 'Failed to login. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const togglePinVisibility = () => setShowPin(!showPin);

	const handleForgotPassword = () => setModalVisible(true);

	const toggleIdentifierType = () => {
		setIdentifierType(prevType => prevType === 'email' ? 'phone' : 'email');
		setIdentifier(''); // Clear the identifier field when switching
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Background Decorative Circle (non-blocking) */}
			<View
				pointerEvents="none"
				style={{ zIndex: -1 }}
				className="absolute top-[-200] right-[-100] w-[400px] h-[400px] rounded-full bg-[#f27c22] bg-opacity-10"
			/>

			{/* Forgot Password Modal */}
			<ForgotPasswordModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
			/>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="flex-1"
			>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ flexGrow: 1 }}
				>
					<View className="flex-1 p-6 justify-between">
						{/* Logo */}
						<View className="items-center mt-24">
							<Image source={logo} className="w-40 h-40" resizeMode="contain" />
						</View>

						{/* Heading */}
						<View className="items-center mt-5 mb-10">
							<Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
							<Text className="text-base text-gray-600">Sign in with PIN</Text>
						</View>

						{/* Form */}
						<View className="mb-8">
							{error ? (
								<View className="mb-4">
									<Text className="text-red-600 text-center">{error}</Text>
								</View>
							) : null}
							
							{/* Toggle Button for Email/Phone */}
							<View className="mb-5 flex-row justify-end">
								<TouchableOpacity 
									className="flex-row items-center" 
									onPress={toggleIdentifierType}
								>
									<Text className="text-[#f27c22] text-sm font-semibold mr-2">
										Use {identifierType === 'email' ? 'Phone' : 'Email'} Instead
									</Text>
									<Ionicons name="swap-horizontal" size={16} color="#f27c22" />
								</TouchableOpacity>
							</View>

							{/* Identifier Field (Email or Phone) */}
							<View className="mb-5">
								<Text className="text-sm font-semibold text-gray-600 mb-2">
									{identifierType === 'email' ? 'Email' : 'Phone Number'}
								</Text>
								<TextInput
									className="bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-900 border border-gray-200"
									placeholder={identifierType === 'email' ? "Enter your email" : "Enter your phone number"}
									placeholderTextColor="#A0AEC0"
									keyboardType={identifierType === 'email' ? "email-address" : "phone-pad"}
									autoCapitalize="none"
									value={identifier}
									onChangeText={setIdentifier}
									style={{ minHeight: 48 }}
								/>
							</View>

							{/* PIN Field */}
							<View className="mb-5">
								<Text className="text-sm font-semibold text-gray-600 mb-2">PIN</Text>
								<View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
									<TextInput
										className="flex-1 px-4 py-3.5 text-base text-gray-900"
										placeholder="Enter your PIN (4 digits)"
										placeholderTextColor="#A0AEC0"
										secureTextEntry={!showPin}
										keyboardType="numeric"
										maxLength={4}
										value={pin}
										onChangeText={setPin}
										style={{ minHeight: 48 }}
									/>
									<TouchableOpacity className="p-3" onPress={togglePinVisibility}>
										<Ionicons name={showPin ? 'eye-off' : 'eye'} size={22} color="#4A5568" />
									</TouchableOpacity>
								</View>
							</View>

							{/* Forgot PIN */}
							<TouchableOpacity className="items-end mb-6" onPress={handleForgotPassword}>
								<Text className="text-[#f27c22] text-sm font-semibold">Forgot PIN?</Text>
							</TouchableOpacity>

							{/* Login Button */}
							<TouchableOpacity
								className="bg-[#f27c22] py-4 rounded-2xl shadow-lg"
								style={{
									shadowColor: '#f27c22',
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.3,
									shadowRadius: 8,
									elevation: 5
								}}
								onPress={handleLogin}
								disabled={isLoading}
							>
								{isLoading ? (
									<ActivityIndicator color="#FFFFFF" />
								) : (
									<Text className="text-white text-center text-lg font-semibold">Sign In</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default LoginScreen;