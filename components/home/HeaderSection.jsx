import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Animated, {  FadeIn } from 'react-native-reanimated';
import { User, AlertTriangle, Shield, Bell } from 'lucide-react-native';
import { router } from 'expo-router';

const HeaderSection = () => {

	const handleRoute = () => {
		router.push('/settings')
	}

	return (
		<View>
			{/* Content Container */}
			<View className="flex-1 p-5 pt-10">
				{/* Top Row */}
				<View className="flex-row justify-between items-start">
					<Animated.View >
						<Text className="text-4xl font-bold text-white">Fire Sentinel</Text>
						<Text className="text-white/80 mt-1">Stay informed • Stay safe</Text>
					</Animated.View>

					<TouchableOpacity
						className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
						onPress={handleRoute}
						accessibilityLabel="User profile"
					>
						<User size={24} color="white" />
					</TouchableOpacity>
				</View>

				{/* Icons Row */}
				<Animated.View
					//   entering={FadeInDown.delay(500).duration(1000)} 
					className="flex-row justify-center items-center mt-8 space-x-12"
				>
					<View className="items-center">
						<View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-2">
							<AlertTriangle size={24} color="white" />
						</View>
						<Text className="text-white text-xs">Alerts</Text>
					</View>

					<View className="items-center">
						<View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-2">
							<Shield size={24} color="white" />
						</View>
						<Text className="text-white text-xs">Protection</Text>
					</View>

					<View className="items-center">
						<View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-2">
							<Bell size={24} color="white" />
						</View>
						<Text className="text-white text-xs">Notifications</Text>
					</View>
				</Animated.View>
			</View>
		</View>
	);
};

export default HeaderSection;