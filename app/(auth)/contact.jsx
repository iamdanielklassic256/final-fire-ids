import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { all_members_url } from '../../api/api';
import axios from 'axios';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../../components/profile/InputField';
import LoadingContact from '../../utils/LoadingContact';

const formatPhoneNumber = (number) => {
	if (!number) return '';
	let cleaned = number.replace(/\D/g, '');
	if (cleaned.startsWith('07')) {
		cleaned = '256' + cleaned.substring(1);
	} else if (cleaned.startsWith('7')) {
		cleaned = '256' + cleaned;
	} else if (cleaned.startsWith('0')) {
		cleaned = '256' + cleaned.substring(1);
	} else if (!cleaned.startsWith('256')) {
		cleaned = '256' + cleaned;
	}
	return '+' + cleaned;
};

const ContactScreen = () => {
	const [member, setMember] = useState(null);
	const [phoneOne, setPhoneOne] = useState('');
	const [phoneTwo, setPhoneTwo] = useState('');
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [updatingFields, setUpdatingFields] = useState({
		contact_one: false,
		contact_two: false,
		email: false
	});

	const fetchMemberData = async () => {
		try {
			const memberData = await AsyncStorage.getItem("member");
			if (memberData) {
				const parsedMember = JSON.parse(memberData);
				setMember(parsedMember);
				setPhoneOne(parsedMember.contact_one || '');
				setPhoneTwo(parsedMember.contact_two || '');
				setEmail(parsedMember.email || '');
			}
		} catch (error) {
			console.error("Error fetching member data:", error);
			Alert.alert("Error", "Failed to load member data");
		}
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		try {
			const token = await AsyncStorage.getItem('accessToken');
			const response = await axios.get(`${all_members_url}/${member.id}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			// Update AsyncStorage with new data
			await AsyncStorage.setItem("member", JSON.stringify(response.data));

			// Update state with new data
			setMember(response.data);
			setPhoneOne(response.data.contact_one || '');
			setPhoneTwo(response.data.contact_two || '');
			setEmail(response.data.email || '');
		} catch (error) {
			console.error("Error refreshing data:", error);
			Alert.alert("Error", "Failed to refresh data");
		} finally {
			setRefreshing(false);
		}
	}, [member?.id]);

	useEffect(() => {
		setLoading(true);
		fetchMemberData().finally(() => setLoading(false));
	}, []);

	const updateField = async (field, value) => {
		setUpdatingFields(prev => ({ ...prev, [field]: true }));
		try {
			const token = await AsyncStorage.getItem('accessToken');
			let formattedValue = value;

			if (field === 'contact_one' || field === 'contact_two') {
				formattedValue = formatPhoneNumber(value);
			}

			const updatedMember = { [field]: formattedValue };
			const response = await axios.patch(`${all_members_url}/${member.id}`, updatedMember, {
				headers: { Authorization: `Bearer ${token}` }
			});

			// Update local state and AsyncStorage with the response data
			const updatedData = response.data;
			await AsyncStorage.setItem("member", JSON.stringify(updatedData));
			setMember(updatedData);

			// Update the specific field state
			if (field === 'contact_one') setPhoneOne(updatedData.contact_one || '');
			if (field === 'contact_two') setPhoneTwo(updatedData.contact_two || '');
			if (field === 'email') setEmail(updatedData.email || '');

			Alert.alert("Success", "Updated successfully");
		} catch (error) {
			console.error(`Error updating ${field}:`, error);
			let errorMessage = "Please try again later.";
			if (error.code === 'ECONNABORTED') {
				errorMessage = "The request timed out. Please check your internet connection.";
			} else if (error.message === 'Network Error') {
				errorMessage = "Unable to connect to the server. Please check your internet connection.";
			}
			Alert.alert("Error", errorMessage);
		} finally {
			setUpdatingFields(prev => ({ ...prev, [field]: false }));
		}
	};

	const validateAndUpdatePhone = (field, value) => {
		const cleaned = value.replace(/\D/g, '');
		if (cleaned.length < 9) {
			Alert.alert("Invalid Phone Number", "Please enter a valid phone number");
			return;
		}
		updateField(field, value);
	};

	if (loading) {
		return (
			<LoadingContact />
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={['#028758']}
						tintColor="#028758"
					/>
				}
			>
				{/* Header */}
				<View style={{
					backgroundColor: '#028758',
					height: 128,
					borderBottomLeftRadius: 40,
					borderBottomRightRadius: 40,
				}}>
					<View style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: 16,
					}}>
						<TouchableOpacity
							style={{
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
								padding: 8,
								borderRadius: 20,
							}}
							onPress={() => router.back()}
						>
							<Ionicons name="arrow-back" size={24} color="white" />
						</TouchableOpacity>
						<Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
							Contact Information
						</Text>
						<View style={{ width: 40 }} />
					</View>
				</View>

				{/* Content */}
				<View style={{
					marginTop: -40,
					marginHorizontal: 16,
					backgroundColor: 'white',
					padding: 24,
					borderRadius: 24,
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 4,
					elevation: 3,
					marginBottom: 24,
				}}>
					{/* Profile Preview */}
					<View style={{ marginBottom: 24 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
							<View style={{
								width: 48,
								height: 48,
								backgroundColor: 'rgba(74, 0, 143, 0.1)',
								borderRadius: 24,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
								<Ionicons name="person-outline" size={24} color="#4a008f" />
							</View>
							<View style={{ marginLeft: 16 }}>
								<Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937' }}>
									{member?.name || 'Member'}
								</Text>
								<Text style={{ color: '#6B7280' }}>ID: {member?.id || 'Loading...'}</Text>
							</View>
						</View>
					</View>

					<InputField
						label="Primary Phone Number"
						value={phoneOne}
						onChangeText={setPhoneOne}
						placeholder="Enter primary phone number"
						keyboardType="phone-pad"
						onUpdate={() => validateAndUpdatePhone('contact_one', phoneOne)}
						icon="call-outline"
						loading={updatingFields.contact_one}
					/>

					<InputField
						label="Secondary Phone Number"
						value={phoneTwo}
						onChangeText={setPhoneTwo}
						placeholder="Enter secondary phone number"
						keyboardType="phone-pad"
						onUpdate={() => validateAndUpdatePhone('contact_two', phoneTwo)}
						icon="phone-portrait-outline"
						optional
						loading={updatingFields.contact_two}
					/>

					<InputField
						label="Email Address"
						value={email}
						onChangeText={setEmail}
						placeholder="Enter email address"
						keyboardType="email-address"
						onUpdate={() => updateField('email', email)}
						icon="mail-outline"
						loading={updatingFields.email}
					/>
				</View>

				{/* Note Section */}
				<View style={{
					marginHorizontal: 16,
					marginBottom: 32,
					padding: 16,
					backgroundColor: 'rgba(2, 135, 88, 0.05)',
					borderRadius: 12,
				}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
						<Ionicons name="information-circle-outline" size={20} color="#028758" />
						<Text style={{ marginLeft: 8, color: '#028758', fontWeight: '600' }}>
							Important Note
						</Text>
					</View>
					<Text style={{ color: '#4B5563', fontSize: 14 }}>
						Please ensure your contact information is up to date. We use this information to send important updates and notifications.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ContactScreen;