import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { verify_phone_url } from '../api/api';

const VerifyOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const getStoredPhone = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('phoneNumber');
        if (storedPhone) {
          setPhoneNumber(storedPhone);
        }
      } catch (error) {
        console.error('Error fetching phone number:', error);
      }
    };
    
    getStoredPhone();
  }, []);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid Code', 'Please enter a valid verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${verify_phone_url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          otp
        })
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const memberData = await AsyncStorage.getItem('member');
      if (memberData) {
        const member = JSON.parse(memberData);
        member.is_phone_verified = true;
        await AsyncStorage.setItem('member', JSON.stringify(member));
      }

      Alert.alert(
        'Success',
        'Phone number verified successfully',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
	  router.push('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to verify code. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(verify_phone_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber
        })
      });

      if (!response.ok) {
        throw new Error('Failed to resend code');
      }

      Alert.alert('Success', 'New verification code sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to send new code. Please try again.');
      console.error(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="items-center mb-8">
        <Icon name="cellphone-message" size={64} color="#4F46E5" />
        <Text className="text-2xl font-bold mt-4 text-gray-900">
          Enter Verification Code
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          We sent a code to {phoneNumber}
        </Text>
      </View>

      <View className="space-y-4">
        <Text className="text-gray-700 font-medium">Verification Code</Text>
        <TextInput
          className="h-12 border border-gray-300 rounded-lg px-4 text-gray-900"
          placeholder="Enter verification code"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />

        <TouchableOpacity
          onPress={handleVerifyOTP}
          disabled={loading}
          className={`h-12 rounded-lg flex-row items-center justify-center ${
            loading ? 'bg-indigo-400' : 'bg-indigo-600'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Verify Code
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResendCode}
          disabled={resendLoading}
          className="flex-row items-center justify-center py-2"
        >
          {resendLoading ? (
            <ActivityIndicator color="#4F46E5" />
          ) : (
            <Text className="text-indigo-600 font-medium">
              Didn't receive code? Send again
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyOTP;