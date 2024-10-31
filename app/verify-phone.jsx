import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { send_phone_verification_url } from '../api/api';

const VerifyPhone = () => {
	
	const [loading, setLoading] = useState(false);


	const [error, setError] = useState(null);
	const [member, setMember] = useState(null);

	useEffect(() => {
		const fetchMemberData = async () => {
			try {
				const memberData = await AsyncStorage.getItem("member");
				if (memberData) {
					const parsedMember = JSON.parse(memberData);
					setMember(parsedMember);
				}
			} catch (error) {
				console.error("Error fetching member data:", error);
				setError("Failed to fetch member data. Please try again.");
			}
		};

		fetchMemberData();
	}, []);

	const myPhoneNumber = member?.contact_one

	const formatPhoneNumber = (number) => {
		// Remove any non-digit characters
		let cleaned = number.replace(/\D/g, '');

		// Add '+256' prefix if not present
		if (!cleaned.startsWith('256')) {
			// Remove leading 0 if present
			if (cleaned.startsWith('0')) {
				cleaned = cleaned.substring(1);
			}
			cleaned = '256' + cleaned;
		}

		return '+' + cleaned;
	};

	const handleVerify = async () => {
		// if (!phoneNumber || phoneNumber.length < 9) {
		// 	Alert.alert('Invalid Phone', 'Please enter a valid phone number');
		// 	return;
		// }

		setLoading(true);
		try {
			const formattedPhone = formatPhoneNumber(myPhoneNumber);

			// Make API call to send verification code
			const response = await fetch(send_phone_verification_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					phoneNumber: formattedPhone
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Failed to send verification code');
			}

			// Store phone number in AsyncStorage
			await AsyncStorage.setItem('phoneNumber', formattedPhone);

			// Navigate to OTP screen
			router.push('/verify-otp');
		} catch (error) {
			Alert.alert(
				'Error',
				error.message || 'Failed to send verification code. Please try again.'
			);
			console.error('Verification error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View className="flex-1 bg-gray-100">
			<View className="bg-[#028758] h-36 rounded-b-3xl">
				<View className="pt-16 px-4">
					<Text className="text-white text-2xl font-bold font-[Poppins-SemiBold]">
						Verify Phone Number
					</Text>
					
				</View>
			</View>

			<View className="px-4 pt-8">
				<View className="bg-white p-4 rounded-xl shadow-sm">
					<Text className="text-gray-600 mb-2 font-[Poppins-Medium]">Phone Number</Text>
					

					<TouchableOpacity
						className={`bg-[#028758] py-4 rounded-xl ${loading ? 'opacity-70' : ''}`}
						onPress={handleVerify}
						disabled={loading}
					>
						<Text className="text-white text-center font-[Poppins-Bold]">
							{loading ? 'Sending Code...' : 'Send Verification Code'}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default VerifyPhone;