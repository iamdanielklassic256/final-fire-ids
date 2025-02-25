import { View, Text, Image, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../assets/logo/logo.png';
import { USER_AUTH_LOGIN_API } from '../../api/api';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			setError('Please enter both email and password');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address');
			return;
		}

		setError('');
		setIsLoading(true);

		try {
			const response = await axios.post(USER_AUTH_LOGIN_API, { email, password }, {
				headers: { 
				  'Content-Type': 'application/json',
				  'Accept': 'application/json'
				}
			  });

			  console.log('response############################')
			  console.log(response.status)
		  

			if (response.status === 200) {
				// console.log('Login successful:', response.data);
				await AsyncStorage.setItem("userEmail", email)
				console.log(AsyncStorage.getItem("userEmail"));
				// Proceed to OTP verification screen
				router.push('/auth/verify-otp');
			} else {
				setError(response.data.message || 'Login failed. Please try again.');
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Network error. Please try again later.');
			console.error('Login error:', err);
		} finally {
			setIsLoading(false);
		}
	};


	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="absolute top-[-200] right-[-100] w-[400px] h-[400px] rounded-full bg-[#f27c22] bg-opacity-10" />

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="flex-1"
			>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<View className="flex-1 p-6 justify-between">
						{/* Logo */}
						<View className="items-center mt-24">
							<Image
								source={logo}
								className="w-40 h-40"
								resizeMode="contain"
							/>
						</View>

						{/* Heading */}
						<View className="items-center mt-5 mb-10">
							<Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
							<Text className="text-base text-gray-600">Sign in to continue</Text>
						</View>

						{/* Login Form */}
						<View className="mb-8">
							{/* Error message if any */}
							{error ? (
								<Text className="text-red-600 mb-4 text-center">{error}</Text>
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
								/>
							</View>

							{/* Password Field with toggle visibility */}
							<View className="mb-5">
								<Text className="text-sm font-semibold text-gray-600 mb-2">Password</Text>
								<View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
									<TextInput
										className="flex-1 px-4 py-3.5 text-base text-gray-900"
										placeholder="Enter your password"
										placeholderTextColor="#A0AEC0"
										secureTextEntry={!showPassword}
										value={password}
										onChangeText={setPassword}
									/>
									<TouchableOpacity
										className="p-3"
										onPress={togglePasswordVisibility}
									>
										<Ionicons
											name={showPassword ? 'eye-off' : 'eye'}
											size={22}
											color="#4A5568"
										/>
									</TouchableOpacity>
								</View>
							</View>

							{/* Forgot Password */}
							<TouchableOpacity
								className="items-end mb-6"
								onPress={() => navigation.navigate('ForgotPassword')}
							>
								<Text className="text-[#f27c22] text-sm font-semibold">Forgot Password?</Text>
							</TouchableOpacity>

							{/* Login Button */}
							<TouchableOpacity
								className="bg-[#f27c22] py-4 rounded-2xl shadow-lg"
								style={{
									shadowColor: '#f27c22',
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.3,
									shadowRadius: 8,
									elevation: 5,
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

						{/* Sign Up Option */}
						<View className="flex-row justify-center mt-6">
							<Text className="text-gray-600 text-base">Don't have an account? </Text>
							<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
								<Text className="text-[#f27c22] text-base font-semibold">Sign Up</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default LoginScreen;