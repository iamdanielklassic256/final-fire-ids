import { View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext
import { useContext } from 'react';

const AboutScreen = () => {
	// Get theme from context
	const { theme } = useContext(ThemeContext);
	const darkMode = theme === 'dark';

	// Theme-based styles
	const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
	const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
	const subTextColor = darkMode ? 'text-gray-400' : 'text-gray-500';
	const cardBgColor = darkMode ? 'bg-gray-800' : 'bg-white';
	const cardBorderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
	const dividerColor = darkMode ? 'bg-gray-700' : 'bg-gray-100';
	const footerBgColor = darkMode ? 'bg-gray-800' : 'bg-gray-50';
	const iconBgColors = {
		blue: darkMode ? 'bg-blue-900' : 'bg-blue-50',
		purple: darkMode ? 'bg-purple-900' : 'bg-purple-50',
		green: darkMode ? 'bg-green-900' : 'bg-green-50',
		orange: darkMode ? 'bg-orange-900' : 'bg-orange-50'
	};

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
		<ScrollView className={`flex-1 ${bgColor}`}>
			{/* Header with back navigation */}
			<View className="px-6 pt-2 pb-4 flex-row items-center">
				<TouchableOpacity onPress={handleBack} className="p-2">
					<Ionicons name="arrow-back" size={24} color="#f27c22" />
				</TouchableOpacity>
			</View>

			{/* App Logo and branding */}
			<View className="items-center justify-center py-8">
				<View className={`w-24 h-24 ${iconBgColors.orange} rounded-3xl shadow-md items-center justify-center`}>
					<Ionicons name="shield-checkmark" size={52} color="#f27c22" />
				</View>
				<Text className={`text-2xl font-bold mt-2 ${textColor}`}>Pro Church Manager</Text>
				<View className="flex-row items-center mt-2">
					<Text className={`${subTextColor} text-base`}>Version</Text>
					<Text className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-base ml-1`}>1.0.1</Text>
				</View>
				
			</View>

			{/* Divider */}
			<View className={`h-px ${dividerColor} mx-8 my-2`} />

			{/* App Description */}
			<View className="px-8 mb-6">
				<Text className={`${textColor} text-center leading-6`}>
				Welcome to the Church Hub web application! This platform is designed to help churches manage and streamline their ministries, services, projects, and other initiatives.
				</Text>
			</View>

			{/* Information Cards */}
			<View className="px-6 mb-8">
				<TouchableOpacity
					className={`${cardBgColor} border ${cardBorderColor} rounded-xl p-4 mb-4 shadow-sm`}
					onPress={handleWebsiteLink}
				>
					<View className="flex-row items-center">
						<View className={`w-10 h-10 ${iconBgColors.blue} rounded-full items-center justify-center`}>
							<Ionicons name="globe-outline" size={20} color="#3b82f6" />
						</View>
						<View className="ml-3 flex-1">
							<Text className={`font-medium ${textColor}`}>Visit Our Website</Text>
							<Text className={`${subTextColor} text-sm`}>prochurchmanager.com</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color={darkMode ? "#6b7280" : "#d1d5db"} />
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					className={`${cardBgColor} border ${cardBorderColor} rounded-xl p-4 mb-4 shadow-sm`}
					onPress={handlePrivacyPolicy}
				>
					<View className="flex-row items-center">
						<View className={`w-10 h-10 ${iconBgColors.purple} rounded-full items-center justify-center`}>
							<Ionicons name="lock-closed-outline" size={20} color="#8b5cf6" />
						</View>
						<View className="ml-3 flex-1">
							<Text className={`font-medium ${textColor}`}>Privacy Policy</Text>
							<Text className={`${subTextColor} text-sm`}>How we protect your data</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color={darkMode ? "#6b7280" : "#d1d5db"} />
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					className={`${cardBgColor} border ${cardBorderColor} rounded-xl p-4 shadow-sm`}
					onPress={handleTermsOfService}
				>
					<View className="flex-row items-center">
						<View className={`w-10 h-10 ${iconBgColors.green} rounded-full items-center justify-center`}>
							<Ionicons name="document-text-outline" size={20} color="#10b981" />
						</View>
						<View className="ml-3 flex-1">
							<Text className={`font-medium ${textColor}`}>Terms of Service</Text>
							<Text className={`${subTextColor} text-sm`}>Rules and guidelines</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color={darkMode ? "#6b7280" : "#d1d5db"} />
					</View>
				</TouchableOpacity>
			</View>

			{/* Developer Credits */}
			<View className={`${footerBgColor} px-6 py-8 rounded-t-3xl`}>
				<Text className={`text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm mb-2`}>Made with ♥ by Daniel Okumu Comboni</Text>
				<Text className={`text-center font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>PixelTech </Text>
				<Text className={`text-center ${subTextColor} text-sm mt-4`}>© 2025 All Rights Reserved</Text>
			</View>
		</ScrollView>
	);
};

export default AboutScreen;