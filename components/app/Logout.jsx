import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import { TouchableOpacity } from 'react-native'
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
		<TouchableOpacity className="items-center" onPress={handleLogOut}>
			<Icon name="logout" size={28} color="white" />
		</TouchableOpacity>
	)
}

export default Logout