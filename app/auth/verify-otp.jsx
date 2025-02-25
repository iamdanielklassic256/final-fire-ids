import { View, Text, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { USERS_VERFIY_OTP, USER_AUTH_LOGIN_API } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const VerifyOTPPage = ({ route, navigation }) => {
  // State to store the email retrieved from AsyncStorage
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  // Fetch email from AsyncStorage when component mounts
  useEffect(() => {
    const getEmailFromStorage = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedEmail) {
          setEmail(storedEmail);
          console.log('userEmail from AsyncStorage:', storedEmail);
        } else {
          console.log('No email found in AsyncStorage');
          setError('User email not found. Please login again.');
        }
      } catch (error) {
        console.error('Error retrieving email from AsyncStorage:', error);
        setError('Error retrieving user data');
      }
    };

    getEmailFromStorage();
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto-focus to the next input
    if (text && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to the previous input on backspace when current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 5) {
      setError('Please enter the complete 5-digit OTP');
      return;
    }
    
    if (!email) {
      setError('User email not available. Please login again.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch(USERS_VERFIY_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      });

      console.log('OTP verification response status:', response.status);
      
      if (response.status === 200) {
        // Get response data
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        // Store access token
        await AsyncStorage.setItem('accessToken', responseData.accessToken);
        
        // Store user data as JSON string
        await AsyncStorage.setItem('userData', JSON.stringify(responseData.data));
        
        console.log('Data stored successfully in AsyncStorage');
        
        // Navigate to the dashboard
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('OTP verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 p-6 justify-center">
            <View className="items-center mb-10">
              <Text className="text-3xl font-bold text-gray-900 mb-4">Verify OTP</Text>
              <Text className="text-base text-gray-600 text-center">
                We've sent a verification code to
              </Text>
              <Text className="text-base font-semibold text-[#f27c22] mt-1">{email}</Text>
            </View>

            {/* Error message if any */}
            {error ? (
              <Text className="text-red-600 mb-4 text-center">{error}</Text>
            ) : null}

            {/* OTP Input */}
            <View className="flex-row justify-between mb-10">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 text-2xl font-bold text-center"
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text.replace(/[^0-9]/g, ''), index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                />
              ))}
            </View>

            {/* Verify Button */}
            <TouchableOpacity 
              className="bg-[#f27c22] py-4 rounded-2xl mb-6 shadow-lg"
              style={{
                shadowColor: '#f27c22',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
              onPress={handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyOTPPage;