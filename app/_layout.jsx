import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null; // Prevent rendering until fonts are loaded
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        
        {/* <Provider store={store}> */}
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="verify-phone"
            options={{
              headerTitle: "Phone Verification",
              headerShown: false,
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
              },
              headerLeft: () => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#ffffff"
                  style={{ marginLeft: 15 }}
                  onPress={() => {
                    router.back();
                    console.log("Go back");
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: '#250048',
              },
              headerTintColor: '#ffffff',
              presentation: 'modal',
              animation: 'slide_from_bottom',
              contentStyle: {
                backgroundColor: '#FFFFFF',
              },
            }}
          />

          <Stack.Screen
            name="verify-otp"
            options={{
              headerTitle: "Verify Code",
              headerShown: true,
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
              },
              headerLeft: () => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#ffffff"
                  style={{ marginLeft: 15 }}
                  onPress={() => {
                    router.back();
                    console.log("Go back");
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: '#250048',
              },
              headerTintColor: '#ffffff',
              presentation: 'modal',
              animation: 'slide_from_bottom',
              contentStyle: {
                backgroundColor: '#FFFFFF',
              },
            }}
          />
          <Stack.Screen
            name="group-meeting/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group-attendance/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group-wallet/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group-savings/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group-invitation/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group-join-request/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="loan-request/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group-member/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group-officers/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group/invitation"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group/view-all"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="wallet/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="member-profile/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="officers/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group-wallet"
            options={{
              headerTitle: "Group Wallet",
              headerShown: true,
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
              },
              headerLeft: () => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#ffffff"
                  style={{ marginLeft: 15 }}
                  onPress={() => {
                    router.back();
                    console.log("Go back");
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: '#250048',
              },
              headerTintColor: '#ffffff',
              presentation: 'fullScreenModal',
              animation: 'slide_from_bottom',
              contentStyle: {
                backgroundColor: '#FFFFFF',
              },
            }}
          />
          <Stack.Screen
            name="dashboard"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'slide_from_bottom',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />

          <Stack.Screen
            name="add-group"
            options={{
              headerShown: false,
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
              },
              headerLeft: () => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#ffffff"
                  style={{ marginLeft: 15 }}
                  onPress={() => {
                    router.back();
                    console.log("Go back");
                  }}
                />
              ),
              // headerTintColor: '#ffffff',
              presentation: 'fullScreenModal',
              animation: 'slide_from_bottom',
              contentStyle: {
                // backgroundColor: '#FFFFFF',
              },
            }}
          />
          <Stack.Screen
            name="add-member"
            options={{
              headerTitle: "Create New Group Member",
              headerShown: true,
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
              },
              headerLeft: () => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#ffffff"
                  style={{ marginLeft: 15 }}
                  onPress={() => {
                    router.back();
                    console.log("Go back");
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: '#250048',
              },
              headerTintColor: '#ffffff',
              presentation: 'modal',
              animation: 'slide_from_bottom',
              contentStyle: {
                backgroundColor: '#FFFFFF',
              },
            }}
          />
          <Stack.Screen
            name="group-profile/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'slide_from_right',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="group/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'slide_from_bottom',
              contentStyle: {
                backgroundColor: '#111827',
              },
            }}
          />
          <Stack.Screen
            name="meetings/[id]"
            options={{
              headerShown: true,
              headerTitle: "GroupMeetings",
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
              },
              headerLeft: () => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#ffffff"
                  style={{ marginLeft: 15 }}
                  onPress={() => {
                    router.back();
                    console.log("Go back");
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: '#250048',
              },
              headerTintColor: '#ffffff',
              presentation: 'modal',
              animation: 'slide_from_bottom',
              contentStyle: {
                backgroundColor: '#FFFFFF',
              },
            }}
          />
          <Stack.Screen
            name="meetings/meeting/[id]"
            options={{
              headerTitle: "Meetings",
              headerShown: true,
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
              },
              headerLeft: () => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#ffffff"
                  style={{ marginLeft: 15 }}
                  onPress={() => {
                    router.back();
                    console.log("Go back");
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: '#250048',
              },
              headerTintColor: '#ffffff',
              presentation: 'modal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#FFFFFF',
              },
            }}
          />
          <Stack.Screen
            name="meetings/meetings"
            options={{
              headerTitle: "Meetings",
              headerShown: true,
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
              },
              headerLeft: () => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#ffffff"
                  style={{ marginLeft: 15 }}
                  onPress={() => {
                    router.back();
                    console.log("Go back");
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: '#250048',
              },
              headerTintColor: '#ffffff',
              presentation: 'modal',
              animation: 'simple_push',
              contentStyle: {
                backgroundColor: '#FFFFFF',
              },
            }}
          />

        </Stack>
      </GestureHandlerRootView>
      {/* </Provider> */}
    </>
  );
}
