import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const handleLogout = async () => {
	try {
		await AsyncStorage.multiRemove(['authToken', 'userData', 'userEmail']);
		router.replace('/sign-in');
	} catch (error) {
		console.error('Logout failed:', error);
	}
};