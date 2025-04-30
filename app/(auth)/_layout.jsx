import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {



	return (
		<>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<StatusBar backgroundColor="#000000" barStyle="light-content" />
				<Stack screenOptions={{ headerShown: false }}>
					
					<Stack.Screen name="sign-up" options={{ headerShown: false }} />
					<Stack.Screen name="sign-in" options={{ headerShown: false }} />
				</Stack>
			</GestureHandlerRootView>
		</>
	);
}
