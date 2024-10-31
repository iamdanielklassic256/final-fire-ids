import React, { useState, useEffect } from 'react';
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
import { reset_password_url } from '../../api/api';

const VerifyPin = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [token, setToken] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch stored phone number when component mounts
        const getStoredPhoneNumber = async () => {
            try {
                const storedNumber = await AsyncStorage.getItem('resetPhoneNumber');
                if (storedNumber) {
                    setPhoneNumber(storedNumber);
                } else {
                    Alert.alert(
                        "Error",
                        "No phone number found. Please try the reset process again.",
                        [{ text: "OK", onPress: () => router.replace("/forgot-password") }]
                    );
                }
            } catch (error) {
                console.error('Error fetching stored phone number:', error);
            }
        };

        getStoredPhoneNumber();
    }, []);

    const handlePinReset = async () => {
        // Validate inputs
        if (!token || token.length !== 6) {
            Alert.alert("Please enter the 6-digit verification code");
            return;
        }

        if (!newPin || newPin.length < 4) {
            Alert.alert("PIN must be at least 4 digits");
            return;
        }

        if (newPin !== confirmPin) {
            Alert.alert("PINs do not match");
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.post(reset_password_url, {
                contact_one: phoneNumber,
                token: token,
                newPin: newPin
            });

            if (response.status === 201 || response.status === 200) {
                Alert.alert(
                    "Success",
                    "Your PIN has been reset successfully",
                    [{ text: "OK", onPress: () => router.replace("/") }]
                );
            }
        } catch (error) {
            console.error('PIN reset error:', error);
            Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to reset PIN. Please try again."
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
                            Verify & Reset PIN
                        </Text>
                        <Text className="text-[#250048] text-base font-bold text-center mt-2.5">
                            Enter the verification code sent to{'\n'}{phoneNumber}
                        </Text>
                    </View>

                    <View className="space-y-4">
                        <View className="bg-white rounded-lg p-3 flex-row items-center">
                            <Ionicons name="key-outline" size={24} color="#250048" />
                            <TextInput
                                placeholder="Verification Code"
                                placeholderTextColor="#000000"
                                value={token}
                                onChangeText={setToken}
                                keyboardType="numeric"
                                maxLength={6}
                                className="text-[#000000] text-base flex-1 ml-2"
                            />
                        </View>

                        <View className="bg-white rounded-lg p-3 flex-row items-center">
                            <Ionicons name="lock-closed-outline" size={24} color="#250048" />
                            <TextInput
                                placeholder="New PIN"
                                placeholderTextColor="#000000"
                                value={newPin}
                                onChangeText={setNewPin}
                                keyboardType="numeric"
                                secureTextEntry
                                maxLength={4}
                                className="text-[#000000] text-base flex-1 ml-2"
                            />
                        </View>

                        <View className="bg-white rounded-lg p-3 flex-row items-center">
                            <Ionicons name="lock-closed-outline" size={24} color="#250048" />
                            <TextInput
                                placeholder="Confirm New PIN"
                                placeholderTextColor="#000000"
                                value={confirmPin}
                                onChangeText={setConfirmPin}
                                keyboardType="numeric"
                                secureTextEntry
                                maxLength={4}
                                className="text-[#000000] text-base flex-1 ml-2"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handlePinReset}
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

                    <View className="mt-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row justify-center items-center bg-white/20 p-4 rounded-full"
                        >
                            <Ionicons name="arrow-back-outline" size={20} color="white" />
                            <Text className="text-white text-base ml-2">Back</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default VerifyPin;