import { View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const AboutScreen = () => {
	const handleBack = () => {
		router.back();
	};

	const handleWebsiteLink = () => {
		Linking.openURL('https://prochurchmanager.com');
	};

	const handlePrivacyPolicy = () => {
		Linking.openURL('https://prochurchmanager.com/privacy');
	};

	const handleTermsOfService = () => {
		Linking.openURL('https://prochurchmanager.com/terms-and-conditions');
	};

	return (
		<ScrollView className="flex-1 bg-white">
			{/* Header with back navigation */}
			<View className="px-6 pt-2 pb-4 flex-row items-center">
				<TouchableOpacity onPress={handleBack} className="p-2">
					<Ionicons name="arrow-back" size={24} color="#f27c22" />
				</TouchableOpacity>
			</View>

			{/* App Logo and branding */}
			<View className="items-center justify-center py-8">
				<View className="w-24 h-24 bg-orange-50 rounded-3xl shadow-md items-center justify-center">
					<Ionicons name="shield-checkmark" size={52} color="#f27c22" />
				</View>
				<Text className="text-2xl font-bold mt-2 text-gray-800">Pro Church Manager</Text>
				<View className="flex-row items-center mt-2">
					<Text className="text-gray-500 text-base">Version</Text>
					<Text className="text-gray-700 font-medium text-base ml-1">1.0.1</Text>
				</View>
				
			</View>

			{/* Divider */}
			<View className="h-px bg-gray-100 mx-8 my-2" />

			{/* App Description */}
			<View className="px-8 mb-6">
				<Text className="text-gray-800 text-center leading-6">
				Welcome to the Church Hub web application! This platform is designed to help churches manage and streamline their ministries, services, projects, and other initiatives.

				</Text>
			</View>

			{/* Information Cards */}
			<View className="px-6 mb-8">
				<TouchableOpacity
					className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
					onPress={handleWebsiteLink}
				>
					<View className="flex-row items-center">
						<View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
							<Ionicons name="globe-outline" size={20} color="#3b82f6" />
						</View>
						<View className="ml-3 flex-1">
							<Text className="font-medium text-gray-800">Visit Our Website</Text>
							<Text className="text-gray-500 text-sm">prochurchmanager.com</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color="#d1d5db" />
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
					onPress={handlePrivacyPolicy}
				>
					<View className="flex-row items-center">
						<View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center">
							<Ionicons name="lock-closed-outline" size={20} color="#8b5cf6" />
						</View>
						<View className="ml-3 flex-1">
							<Text className="font-medium text-gray-800">Privacy Policy</Text>
							<Text className="text-gray-500 text-sm">How we protect your data</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color="#d1d5db" />
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
					onPress={handleTermsOfService}
				>
					<View className="flex-row items-center">
						<View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center">
							<Ionicons name="document-text-outline" size={20} color="#10b981" />
						</View>
						<View className="ml-3 flex-1">
							<Text className="font-medium text-gray-800">Terms of Service</Text>
							<Text className="text-gray-500 text-sm">Rules and guidelines</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color="#d1d5db" />
					</View>
				</TouchableOpacity>
			</View>

			{/* Developer Credits */}
			<View className="bg-gray-50 px-6 py-8 rounded-t-3xl">
				<Text className="text-center text-gray-400 text-sm mb-2">Made with ♥ by Daniel Okumu Comboni</Text>
				<Text className="text-center font-medium text-gray-700">PixelTech </Text>
				<Text className="text-center text-gray-500 text-sm mt-4">© 2025 All Rights Reserved</Text>
			</View>
		</ScrollView>
	);
};

export default AboutScreen;