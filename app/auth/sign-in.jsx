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
	Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../assets/logo/logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForgotPasswordModal from '../../components/authenication/ForgotPasswordModal';
import { USER_AUTH_PIN_LOGIN_API } from '../../api/api';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [pin, setPin] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [showPin, setShowPin] = useState(false);

	useEffect(() => {
		const getSavedEmail = async () => {
			try {
				const userEmail = await AsyncStorage.getItem("userEmail");
				if (userEmail) setEmail(userEmail);
			} catch (error) {
				console.error('Error retrieving saved email:', error);
			}
		};
		getSavedEmail();
	}, []);

	const handleLogin = async () => {
		// Reset previous errors
		setError('');

		// Input validation
		if (!email || !pin) {
			setError('Email and PIN are required');
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address');
			return;
		}

		// PIN validation
		if (pin.length < 4 || pin.length > 6) {
			setError('PIN must be between 4-6 digits');
			return;
		}

		// Start loading
		setIsLoading(true);

		try {
			// Make API call to login
			const response = await fetch('http://localhost:9000/api/v1/users/auth/login-with-pin', {
				method: 'POST',
				headers: {
					'Accept': '*/*',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					pin,
				}),
			});

			console.log(response.status)

			const data = await response.json();

			console.log(data)

			// Handle response based on status code
			if (response.status === 201) {
				// Success - store user data
				await AsyncStorage.setItem('userEmail', email);

				// Store auth token if present
				if (data.token) {
					await AsyncStorage.setItem('authToken', data.token);
				}

				// Store user data if available
				if (data.user) {
					await AsyncStorage.setItem('userData', JSON.stringify(data.user));
				}

				// Clear PIN field for security
				setPin('');

				// Navigate to home screen
				navigation.replace('Home');
			}
			else if (response.status === 406) {
				// Invalid credentials
				setError('Invalid email or PIN. Please try again.');
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
									<Text className="text-red-600 text-center">{error}
									</Text>

								</View>
							) : null}
							{/* Email Field */}
							<View className="mb-5">
								<Text className="text-sm font-semibold text-gray-600 mb-2">Email</Text>
								<TextInput
									className="bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-900 border border-gray-200"
									placeholder="Enter your email"
									placeholderTextColor="#A0AEC0"
									keyboardType="email-address"
									autoCapitalize="none"
									value={email}
									onChangeText={setEmail}
									style={{ minHeight: 48 }}
								/>
							</View>

							{/* PIN Field */}
							<View className="mb-5">
								<Text className="text-sm font-semibold text-gray-600 mb-2">PIN</Text>
								<View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
									<TextInput
										className="flex-1 px-4 py-3.5 text-base text-gray-900"
										placeholder="Enter your PIN (4-6 digits)"
										placeholderTextColor="#A0AEC0"
										secureTextEntry={!showPin}
										keyboardType="numeric"
										maxLength={6}
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