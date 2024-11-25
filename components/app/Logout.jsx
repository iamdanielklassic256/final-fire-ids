import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Logout = () => {

	const handleLogOut = async () => {
		try {
			await AsyncStorage.removeItem("member");
			await AsyncStorage.removeItem("accessToken");
			router.push("/sign-in");
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	return (
		<TouchableOpacity className="flex flex-row justify-center items-center" onPress={handleLogOut}>
			<Icon name="logout" size={28} color="white" />
			<Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>Log Out</Text>
		</TouchableOpacity>
	)
}

export default Logout