import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loader } from "../../components";

const AuthLayout = () => {
  

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="verify-pin"
          options={{
            headerShown: false,
          }}
        />
          <Stack.Screen name="contact" options={{ headerShown: false, presentation: "fullScreenModal" }}  />
      </Stack>

      <Loader/>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
