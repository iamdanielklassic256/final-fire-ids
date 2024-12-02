import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { login_url } from '../../api/api';
import logo from '../../assets/icons/logo/logoname.png';

const Login = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    pinCode: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formatPhoneNumber = (number) => {
    let cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('07')) {
      cleaned = '256' + cleaned.substring(1);
    } else if (!cleaned.startsWith('256')) {
      if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
      }
      cleaned = '256' + cleaned;
    }
    return '+' + cleaned;
  };

  const handleLogin = async () => {
    if (!formData.phoneNumber || !formData.pinCode) {
      Alert.alert("Error", "Please enter both phone number and PIN code");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(login_url, {
        contact_one: formatPhoneNumber(formData.phoneNumber),
        personal_identification_number: formData.pinCode
      });

      if (response.status === 201 && response.data?.data) {
        const { data: userData, accessToken } = response.data;

        if (accessToken) {
          await AsyncStorage.setItem("accessToken", accessToken);
          await AsyncStorage.setItem("member", JSON.stringify(userData));
          router.push("/app");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.status === 406
        ? "Incorrect phone number or PIN code"
        : "An error occurred while logging in. Please try again.";
      Alert.alert("Login Failed", errorMessage);
      console.log(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#028758', '#016d46', '#028758']}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              entering={FadeInDown.duration(1000)}
              className="flex-1 p-6"
            >
              {/* Header */}
              <View className="items-center mb-12">
                <View className="w-36 h-36 bg-white/20 rounded-3xl mb-4 items-center justify-center">
                  <Image
                    source={logo}
                    className="w-[120px] h-[120px] rounded-3xl"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-white text-3xl font-bold">Welcome Back</Text>
                <Text className="text-gray-300 text-lg mt-2">Sign in to your account</Text>
              </View>

              <Animated.View
                entering={FadeInUp.duration(500)}
                className="space-y-6"
              >
                {/* Phone Number Input */}
                <View>
                  <Text className="text-white text-sm mb-1">Phone Number</Text>
                  <View className="bg-white bg-opacity-20 rounded-lg flex-row items-center">
                    <TextInput
                      className="flex-1 p-3 text-blackdf"
                      placeholder="Enter your phone number"
                      placeholderTextColor="#000"
                      value={formData.phoneNumber}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
                      keyboardType="phone-pad"
                    />
                    <Ionicons name="call-outline" size={24} color="white" className="mr-3" />
                  </View>
                </View>

                {/* PIN Input */}
                <View>
                  <Text className="text-white text-sm mb-1">PIN Code</Text>
                  <View className="bg-white bg-opacity-20 rounded-lg flex-row items-center">
                    <TextInput
                      className="flex-1 p-3 text-black"
                      placeholder="Enter your PIN"
                      placeholderTextColor="#000"
                      value={formData.pinCode}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, pinCode: text }))}
                      keyboardType="numeric"
                      secureTextEntry={!showPassword}
                      maxLength={4}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="px-3"
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot PIN */}
                <TouchableOpacity
                  onPress={() => router.push("/forgot-password")}
                  className="items-end"
                >
                  <Text className="text-white text-sm">Forgot PIN?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  className="bg-[#250048] p-4 rounded-lg items-center"
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold text-lg">Sign In</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px] bg-white/20" />
                  <Text className="text-white/60 mx-4">OR</Text>
                  <View className="flex-1 h-[1px] bg-white/20" />
                </View>

                {/* Account Type Buttons */}
                <View className="space-y-4">
                  <TouchableOpacity
                    onPress={() => router.push("/sign-up")}
                    className="bg-white/20 p-4 rounded-lg flex-row justify-center items-center space-x-2"
                  >
                    <Ionicons name="person-add-outline" size={20} color="white" />
                    <Text className="text-white font-bold">Create New Account</Text>
                  </TouchableOpacity>

                  <View className="flex-row space-x-4">
                    <TouchableOpacity
                      onPress={() => router.push("/sign-in")}
                      className="flex-1 bg-[#250048] p-4 rounded-lg items-center"
                    >
                      <Text className="text-white font-bold">Personal Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push("/group-login")}
                      className="flex-1 bg-[#250048] p-4 rounded-lg items-center"
                    >
                      <Text className="text-white font-bold">Group Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Login;