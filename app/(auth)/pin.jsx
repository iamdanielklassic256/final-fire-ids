import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from "expo-router";
import logo from '../../assets/icons/logo/logoname.png';
import { update_pin_url } from '../../api/api';

const UpdatePinCodeScreen = () => {
  const [currentPinCode, setCurrentPinCode] = useState('');
  const [newPinCode, setNewPinCode] = useState('');
  const [confirmNewPinCode, setConfirmNewPinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePinCode = async () => {
    if (!currentPinCode || !newPinCode || !confirmNewPinCode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPinCode !== confirmNewPinCode) {
      Alert.alert('Error', 'New PIN codes do not match');
      return;
    }

    if (newPinCode.length < 4) {
      Alert.alert('Error', 'PIN code must be at least 4 digits');
      return;
    }

    try {
      setIsLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      console.log('Request URL:', update_pin_url);
      console.log('Access Token:', accessToken);
      
      if (!accessToken) {
        Alert.alert('Error', 'Please login again');
        router.push('/login');
        return;
      }

      const requestData = {
        currentPinCode: currentPinCode,
        newPinCode: newPinCode
      };

      console.log('Request payload:', requestData);

      const response = await axios.patch(
        update_pin_url,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('API Response:', response.data);

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Success',
          'PIN code updated successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Update PIN error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });

      let errorMessage = 'Failed to update PIN code';
      
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = 'Update PIN service not found. Please try again later.';
            break;
          case 401:
            errorMessage = 'Session expired. Please login again.';
            await AsyncStorage.removeItem('accessToken');
            router.push('/login');
            break;
          case 400:
            errorMessage = error.response.data?.message || 'Invalid PIN code format';
            break;
          case 403:
            errorMessage = 'Current PIN code is incorrect';
            break;
          default:
            errorMessage = error.response.data?.message || 'Failed to update PIN code';
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#028758', '#4a008f']}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 p-5"
        >
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold ml-2">
              Update PIN Code
            </Text>
          </View>

          <View className="items-center mb-8">
            <Image
              source={logo}
              className="w-32 h-32 rounded-full"
              resizeMode="contain"
            />
          </View>

          <View className="space-y-4">
            <View className="bg-white rounded-lg p-3 flex-row items-center">
              <Ionicons name="lock-closed-outline" size={24} color="#028758" />
              <TextInput
                placeholder="Current PIN Code"
                placeholderTextColor="#000000"
                value={currentPinCode}
                onChangeText={setCurrentPinCode}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                className="text-[#000000] text-base flex-1 ml-2"
              />
            </View>

            <View className="bg-white rounded-lg p-3 flex-row items-center">
              <Ionicons name="key-outline" size={24} color="#028758" />
              <TextInput
                placeholder="New PIN Code"
                placeholderTextColor="#000000"
                value={newPinCode}
                onChangeText={setNewPinCode}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                className="text-[#000000] text-base flex-1 ml-2"
              />
            </View>

            <View className="bg-white rounded-lg p-3 flex-row items-center">
              <Ionicons name="key-outline" size={24} color="#028758" />
              <TextInput
                placeholder="Confirm New PIN Code"
                placeholderTextColor="#000000"
                value={confirmNewPinCode}
                onChangeText={setConfirmNewPinCode}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                className="text-[#000000] text-base flex-1 ml-2"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUpdatePinCode}
            disabled={isLoading}
            className={`mt-8 p-4 rounded-full ${isLoading ? 'bg-[#4a008f]' : 'bg-[#028758]'}`}
          >
            {isLoading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="text-[#ffffff] text-center text-lg font-bold ml-2">
                  Updating...
                </Text>
              </View>
            ) : (
              <Text className="text-[#ffffff] text-center text-lg font-bold">
                Update PIN Code
              </Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default UpdatePinCodeScreen;