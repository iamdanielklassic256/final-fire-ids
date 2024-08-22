import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { all_members_url } from '../../api/api';
import axios from 'axios';
import { router } from 'expo-router';

const ContactScreen = () => {
	const [member, setMember] = useState(null);
	const [phoneOne, setPhoneOne] = useState('');
	const [phoneTwo, setPhoneTwo] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
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

		fetchMemberData();
	}, []);

	const updateField = async (field, value) => {
		console.log('Attempting to update at URL:', all_members_url);
		console.log(`${all_members_url}/${member.id}`)
		try {
			const token = await AsyncStorage.getItem('accessToken');
			console.log(`Access token: ${token}`);
			const updatedMember = { [field]: value }; // Modified to only send the field being updated
			await axios.patch(`${all_members_url}/${member.id}`, updatedMember, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setMember((prev) => ({ ...prev, [field]: value }));
			Alert.alert("Success", `${field} updated successfully`);
		} catch (error) {
			console.error(`Error updating ${field}:`, error);
			if (error.code === 'ECONNABORTED') {
				Alert.alert("Error", "The request timed out. Please check your internet connection and try again.");
			} else if (error.message === 'Network Error') {
				Alert.alert("Error", "Unable to connect to the server. Please check your internet connection and try again.");
			} else {
				Alert.alert("Error", `Failed to update ${field}. Please try again later.`);
			}
		}
	};	

	const handleSave = async () => {
		try {
			const token = await AsyncStorage.getItem('userToken');
			const updatedMember = { ...member, contact_one: contactOne, contact_two: contactTwo, email: email };
			await axios.put(all_members_url, updatedMember, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setMember(updatedMember);
			Alert.alert("Success", "All contact information updated successfully");
		} catch (error) {
			console.error("Error saving member data:", error);
			Alert.alert("Error", "Failed to save contact information");
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
			<ScrollView>
				<View style={{ backgroundColor: '#2563eb', padding: 16 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<TouchableOpacity onPress={() => router.back()}>
							<Ionicons name="arrow-back" size={24} color="white" />
						</TouchableOpacity>
						<Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 16 }}>Contact Information</Text>
					</View>
				</View>

				<View style={{ padding: 16 }}>
					<View style={{ marginBottom: 16 }}>
						<Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Primary Phone Number</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TextInput
								style={{ flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 8, marginRight: 8 }}
								value={phoneOne}
								onChangeText={setPhoneOne}
								placeholder="Enter primary phone number"
								keyboardType="phone-pad"
							/>
							<TouchableOpacity
								style={{ backgroundColor: '#4CAF50', padding: 12, borderRadius: 8 }}
								onPress={() => updateField('contact_one', phoneOne)}
							>
								<Text style={{ color: 'white' }}>Update</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ marginBottom: 16 }}>
						<Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Secondary Phone Number (Optional)</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TextInput
								style={{ flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 8, marginRight: 8 }}
								value={phoneTwo}
								onChangeText={setPhoneTwo}
								placeholder="Enter secondary phone number"
								keyboardType="phone-pad"
							/>
							<TouchableOpacity
								style={{ backgroundColor: '#4CAF50', padding: 12, borderRadius: 8 }}
								onPress={() => updateField('contact_two', phoneTwo)}
							>
								<Text style={{ color: 'white' }}>Update</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ marginBottom: 24 }}>
						<Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Email Address</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TextInput
								style={{ flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 8, marginRight: 8 }}
								value={email}
								onChangeText={setEmail}
								placeholder="Enter email address"
								keyboardType="email-address"
							/>
							<TouchableOpacity
								style={{ backgroundColor: '#4CAF50', padding: 12, borderRadius: 8 }}
								onPress={() => updateField('email', email)}
							>
								<Text style={{ color: 'white' }}>Update</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ContactScreen;