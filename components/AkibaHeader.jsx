import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';

const AkibaHeader = ({ title, message, icon, color, handlePress }) => {
	return (
		<View className="bg-[#111827] flex-row justify-between rounded-b-[30px] items-center px-6 py-10">
			<TouchableOpacity
				onPress={handlePress}
				style={styles.backButton}
			>
				<Ionicons name={icon} size={24} color={color} />
			</TouchableOpacity>
			<View className="flex-row items-center gap-4">
				<View className="ml-3 flex items-end">
					<Text className="text-white font-bold text-[20px]">{title}</Text>
					<Text className="text-white/70 text-end  text-[14px]">{message}</Text>
				</View>
				
				<View className="w-16 h-16 bg-[#028758] rounded-full items-center justify-center">

					<Image
						source={require('../assets/icons/logo/logoname.png')}
						className="w-14 h-14"
						resizeMode="contain"
					/>
				</View>

			</View>


		</View>
	)
}

export default AkibaHeader


const styles = StyleSheet.create({
	backButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
})
