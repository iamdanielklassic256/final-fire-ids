import 'react-native-reanimated';
import { Stack, } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, StatusBar } from 'react-native';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function ProfileRootLayout() {

	return (
		<>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<StatusBar backgroundColor="#f27c22" barStyle="light-content" />
				<Stack
				screenOptions={{
					headerShown: false
				}}	
				>
					<Stack.Screen
						name="profile"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
			</GestureHandlerRootView>
			{/* </Provider> */}
		</>
	);
}
