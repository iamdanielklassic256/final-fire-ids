import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AkibaHeader = ({ title, message }) => {
	return (
		<View className="bg-[#111827] flex-row justify-between rounded-b-[30px] items-center px-6 py-10">
			<View className="flex-row items-center">
				<View className="w-16 h-16 bg-[#028758] rounded-full items-center justify-center">
					<Image
						source={require('../assets/icons/logo/logoname.png')}
						className="w-14 h-14"
						resizeMode="contain"
					/>
				</View>
				<View className="ml-3">
					<Text className="text-white font-bold text-[24px]">{title}</Text>
					<Text className="text-white/70 text-[16px]">{message}</Text>
				</View>
			</View>
			
		</View>
	)
}

export default AkibaHeader