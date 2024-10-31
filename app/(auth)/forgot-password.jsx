import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    ActivityIndicator,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { Loader } from "../../components";
import { router } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../assets/icons/logo/logoname.png';
import { forgot_password_url } from '../../api/api';

const { width } = Dimensions.get('window');

const ForgotPassword = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const formatPhoneNumber = (number) => {
        // Remove any non-digit characters
        let cleaned = number.replace(/\D/g, '');

        // Handle numbers starting with '07'
        if (cleaned.startsWith('07')) {
            cleaned = '256' + cleaned.substring(1);
        }
        // Handle other cases as before
        else if (!cleaned.startsWith('256')) {
            // Remove leading 0 if present
            if (cleaned.startsWith('0')) {
                cleaned = cleaned.substring(1);
            }
            cleaned = '256' + cleaned;
        }

        return '+' + cleaned;
    };

    const handlePhoneNumberChange = (text) => {
        // Store raw input
        setPhoneNumber(text);
    };

    const handleResetRequest = async () => {
        if (!phoneNumber) {
            Alert.alert("Enter your phone number");
            return;
        }

        try {
            setIsLoading(true);
            
            // Format phone number before sending to API
            const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
            
            // Store formatted phone number in AsyncStorage for verification
            await AsyncStorage.setItem('resetPhoneNumber', formattedPhoneNumber);

            const response = await axios.post(forgot_password_url, {
                contact_one: formattedPhoneNumber
            });

            if (response.status === 201) {
                Alert.alert(
                    "Success",
                    "PIN reset instructions have been sent to your phone number",
                    [{ text: "OK", onPress: () => router.push("/verify-pin") }]
                );
            }
        } catch (error) {
            console.error('Reset request error:', error);
            Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to process your request. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <StatusBar style="light" />
            <Loader />

            <LinearGradient
                colors={['#028758', '#00E394', '#028758']}
                className="flex-1 justify-between p-5"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 justify-center"
                >
                    <View className="items-center mb-10">
                        <Image
                            source={logo}
                            className="w-32 h-32 rounded-full mb-6"
                            resizeMode="contain"
                        />
                        <Text className="text-white text-3xl font-bold">
                            Reset PIN
                        </Text>
                        <Text className="text-[#250048] text-base font-bold text-center mt-2.5">
                            Enter your phone number to receive reset instructions
                        </Text>
                    </View>

                    <View className="space-y-4">
                        <View className="bg-white rounded-lg p-3 flex-row items-center">
                            <Ionicons name="call-outline" size={24} color="#250048" />
                            <TextInput
                                placeholder="Phone Number (e.g., 0712345678)"
                                placeholderTextColor="#000000"
                                value={phoneNumber}
                                onChangeText={handlePhoneNumberChange}
                                keyboardType="phone-pad"
                                className="text-[#000000] text-base flex-1 ml-2"
                            />
                        </View>
                        <Text className="text-white text-xs opacity-70 ml-2">
                            {phoneNumber ? `Will be formatted as: ${formatPhoneNumber(phoneNumber)}` : ''}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleResetRequest}
                        disabled={isLoading}
                        className={`mt-8 p-4 rounded-full ${isLoading ? 'bg-[#4a008f]' : 'bg-[#250048]'}`}
                    >
                        {isLoading ? (
                            <View className="flex-row justify-center items-center">
                                <ActivityIndicator size="small" color="#ffffff" />
                                <Text className="text-[#ffffff] text-center text-lg font-bold ml-2">
                                    processing ...
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-[#ffffff] text-center text-lg font-bold">
                                RESET PIN
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View className="mt-6 space-y-4">
                        <View className="flex-row justify-center items-center space-x-2">
                            <View className="h-[1px] bg-white opacity-30 flex-1" />
                            <Text className="text-white opacity-70">OR</Text>
                            <View className="h-[1px] bg-white opacity-30 flex-1" />
                        </View>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row justify-center items-center bg-white/20 p-4 rounded-full"
                        >
                            <Ionicons name="arrow-back-outline" size={20} color="white" />
                            <Text className="text-white text-base ml-2">Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default ForgotPassword;