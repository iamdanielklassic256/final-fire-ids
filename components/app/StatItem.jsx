import { useState } from "react";
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const StatItem = ({ title, value, icon, color, onPress }) => {
	const [scaleAnim] = useState(new Animated.Value(1));
  
	const handlePressIn = () => {
	  Animated.spring(scaleAnim, {
		toValue: 0.95,
		useNativeDriver: true,
	  }).start();
	};
  
	const handlePressOut = () => {
	  Animated.spring(scaleAnim, {
		toValue: 1,
		friction: 3,
		tension: 40,
		useNativeDriver: true,
	  }).start();
	};
  
	return (
	  <AnimatedTouchableOpacity 
		className={`flex-row items-center mb-4 p-3 rounded-lg ${color}`}
		style={{ transform: [{ scale: scaleAnim }] }}
		onPressIn={handlePressIn}
		onPressOut={handlePressOut}
		onPress={onPress}
	  >
		<View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3">
		  <Icon name={icon} size={24} color={color.replace('bg-', 'text-')} />
		</View>
		<View className="flex-1">
		  <Text className="text-white text-sm">{title}</Text>
		  <Text className="text-white text-lg font-bold">UGX {value}</Text>
		</View>
		{/* <Icon name="chevron-right" size={24} color="white" /> */}
	  </AnimatedTouchableOpacity>
	);
  };

  export default StatItem;