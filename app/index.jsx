import React from 'react';
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from "expo-status-bar";
import { Loader } from "../components";
import { router } from "expo-router";
import logo from '../assets/icons/logo/logoname.png';

const Welcome = () => {


  return (
    <SafeAreaView className="flex-1 h-full">
      <StatusBar style="light" />
      <Loader />

      <LinearGradient
        colors={['#028758', '#00E394', '#028758']}
        className="flex-1 justify-between p-5"
      >
        <View className="items-center mt-[10%]">
          <Image
            source={logo}
            className="w-[40%] h-[40%] rounded-[20px]"
            resizeMode="contain"
          />
          <Text className="text-white text-3xl font-bold mt-5">
            Welcome to Akiba
          </Text>
          <Text className="text-[#E0E0E0] text-base text-center mt-2.5">
            Your pathway to financial growth and security
          </Text>
        </View>

        <View className="mb-[5%]">
          <TouchableOpacity
            onPress={() => router.push("/sign-in")}
            className="bg-white p-4 rounded-full mb-4"
          >
            <Text className="text-[#250048] text-center text-lg font-bold">
              LOGIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/sign-up")}
            className="bg-[#250048] p-4 rounded-full"
          >
            <Text className="text-[#ffffff] text-center text-lg font-bold">
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Welcome;