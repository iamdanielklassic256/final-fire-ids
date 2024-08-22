import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert } from "react-native";
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

const Login = () => {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [pinCode, setPinCode] = useState("");



	



	
	const handleLogin = async () => {
		console.log('Login with:', { phoneNumber, pinCode });
		try {
			console.log('Processing...');
			const response = await axios.post(login_url, {
				contact_one: phoneNumber,
				personal_identification_number: pinCode
			});
	
			if (response.status === 201 && response.data && response.data.data) {
				const userData = response.data.data;
				const accessToken = response.data.accessToken;


				console.log('Hello....', userData)
				console.log('Hello 2 ....', accessToken)
	
				if (accessToken) {
					await AsyncStorage.setItem("accessToken", accessToken);
				  } else {
					console.warn('Access token is undefined');
					return; // Exit early to avoid further processing
				  }
				if (userData) {
					await AsyncStorage.setItem("member", JSON.stringify(userData));
				} else {
					console.warn('User data is undefined');
				}
	
				// setIsLogged(true);
				console.log('Login Success', userData);
	
				Alert.alert("Login Success!");
				router.push("/app");
			} else if (response.status === 406) {
				Alert.alert("Wrong PIN Code!");
				console.log('Wrong PIN Code!');
			} else {
				console.error('Login failed:', response.data);
				Alert.alert('Login Failed', 'Please try again');
			}
		} catch (err) {
			console.error('Login error:', err);
			Alert.alert('Error', 'An error occurred while logging in. Please try again.');
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
					<View className="items-center mb-10">
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
					</View>

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
						className="bg-[#250048] mt-8 p-4 rounded-full"
					>
						<Text className="text-[#ffffff] text-center text-lg font-bold">
							LOGIN
						</Text>
					</TouchableOpacity>

					{/* <TouchableOpacity className="mt-4">
						<Text className="text-white text-center text-base">
							Forgot PIN?
						</Text>
					</TouchableOpacity> */}

					<TouchableOpacity
						onPress={() => router.push("/sign-up")}
						className="mt-6 flex-row justify-center items-center"
					>
						<Text className="text-white text-base mr-1">Don't have an account?</Text>
						<Text className="text-white text-base font-bold">Sign Up</Text>
					</TouchableOpacity>
				</KeyboardAvoidingView>
			</LinearGradient>
		</SafeAreaView>
	);
};

export default Login;