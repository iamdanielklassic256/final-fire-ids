import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Image,
	Alert,
	ActivityIndicator,
	Animated,
	Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { Loader } from "../../components";
import { router } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../assets/icons/logo/logoname.png';
import { login_url } from '../../api/api';

const { width } = Dimensions.get('window');

const Login = () => {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [pinCode, setPinCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showForgotPin, setShowForgotPin] = useState(false);



	const formatPhoneNumber = (number) => {
		// Remove any non-digit characters
		let cleaned = number.replace(/\D/g, '');

		// Handle numbers starting with '07'
		if (cleaned.startsWith('07')) {
			cleaned = '256' + cleaned.substring(1);
		}
		// Handle other cases as before
		else if (!cleaned.startsWith('256')) {
			// Remove leading 0 if present
			if (cleaned.startsWith('0')) {
				cleaned = cleaned.substring(1);
			}
			cleaned = '256' + cleaned;
		}

		return '+' + cleaned;
	};


	const handleLogin = async () => {
		console.log('Login with:', { phoneNumber, pinCode });
		if (phoneNumber && pinCode) {
			try {
				setIsLoading(true);
				const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
				console.log('Formatted phone number:', formattedPhoneNumber, phoneNumber);
				console.log('Processing...');
				const response = await axios.post(login_url, {
					contact_one: formattedPhoneNumber,
					personal_identification_number: pinCode
				});

				if (response.status === 201 && response.data && response.data.data) {
					const userData = response.data.data;
					const accessToken = response.data.accessToken;

					if (accessToken) {
						await AsyncStorage.setItem("accessToken", accessToken);
					} else {
						console.warn('Access token is undefined');
						return;
					}
					if (userData) {
						await AsyncStorage.setItem("member", JSON.stringify(userData));
					} else {
						console.warn('User data is undefined');
					}

					Alert.alert("Login Success!");
					router.push("/app");
				} else {
					console.error('Unexpected response:', response.data);
					Alert.alert('Login Failed', 'Unexpected response from server. Please try again.');
				}
			} catch (err) {
				if (err.response && err.response.status === 406) {
					console.log('Wrong PIN Code');
					Alert.alert("Login Failed", "Incorrect Contact or PIN code.");
					animateForgotPin(); // Show forgot PIN option after failed attempt
				} else {
					console.error('Login error:', err.response ? err.response.data : err.message);
					Alert.alert('Error', 'An error occurred while logging in. Please try again.');
				}
			} finally {
				setIsLoading(false);
			}
		}
		else if (!phoneNumber) {
			Alert.alert("Enter your phone number");
		}
		else {
			Alert.alert('Enter your pin code')
		}
	};

	return (
		<SafeAreaView className="flex-1">
			<StatusBar style="light" />
			<Loader />

			<LinearGradient
				colors={['#028758', '#00E394', '#028758']}
				className="flex-1 justify-between p-5"
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					className="flex-1 justify-center"
				>
					<Animated.View

						className="items-center mb-10"
					>
						<Image
							source={logo}
							className="w-32 h-32 rounded-full mb-6"
							resizeMode="contain"
						/>
						<Text className="text-white text-3xl font-bold">
							Welcome Back
						</Text>
						<Text className="text-[#250048] text-base font-bold text-center mt-2.5">
							Login to your account
						</Text>
					</Animated.View>

					<View className="space-y-4">
						<View className="bg-white rounded-lg p-3 flex-row items-center">
							<Ionicons name="call-outline" size={24} color="#250048" />
							<TextInput
								placeholder="Phone Number"
								placeholderTextColor="#000000"
								value={phoneNumber}
								onChangeText={setPhoneNumber}
								keyboardType="phone-pad"
								className="text-[#000000] text-base flex-1 ml-2"
							/>
						</View>

						<View className="bg-white rounded-lg p-3 flex-row items-center">
							<Ionicons name="lock-closed-outline" size={24} color="#250048" />
							<TextInput
								placeholder="PIN Code"
								placeholderTextColor="#000000"
								value={pinCode}
								onChangeText={setPinCode}
								keyboardType="numeric"
								secureTextEntry
								className="text-[#000000] text-base flex-1 ml-2"
							/>
						</View>
					</View>

					<TouchableOpacity
						onPress={handleLogin}
						disabled={isLoading}
						className={`mt-8 p-4 rounded-full ${isLoading ? 'bg-[#4a008f]' : 'bg-[#250048]'}`}
					>
						{isLoading ? (
							<View className="flex-row justify-center items-center">
								<ActivityIndicator size="small" color="#ffffff" />
								<Text className="text-[#ffffff] text-center text-lg font-bold ml-2">
									processing ...
								</Text>
							</View>
						) : (
							<Text className="text-[#ffffff] text-center text-lg font-bold">
								LOGIN
							</Text>
						)}
					</TouchableOpacity>

					{showForgotPin && <ResetPinCard />}

					<View className="mt-6 space-y-4">
						<TouchableOpacity
							onPress={() => router.push("/forgot-password")}
							className="flex-row justify-center items-center"
						>
							<Ionicons name="help-circle-outline" size={20} color="white" />
							<Text className="text-white text-center text-base ml-2">
								Forgot PIN?
							</Text>
						</TouchableOpacity>

						<View className="flex-row justify-center items-center space-x-2">
							<View className="h-[1px] bg-white opacity-30 flex-1" />
							<Text className="text-white opacity-70">OR</Text>
							<View className="h-[1px] bg-white opacity-30 flex-1" />
						</View>

						<TouchableOpacity
							onPress={() => router.push("/sign-up")}
							className="flex-row justify-center items-center bg-white/20 p-4 rounded-full"
						>
							<Ionicons name="person-add-outline" size={20} color="white" />
							<Text className="text-white text-base ml-2">Create New Account</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</LinearGradient>
		</SafeAreaView>
	);
};

export default Login;