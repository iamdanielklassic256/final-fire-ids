import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Linking,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import logo from '../../assets/icons/logo/logoname.png';
import Benefits from '../../components/profile/Benefits';

const VerificationScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [member, setMember] = useState(null);

  const fetchMemberData = async () => {
    try {
      setIsLoading(true);
      const memberData = await AsyncStorage.getItem("member");
      if (memberData) {
        const parsedMember = JSON.parse(memberData);
        setMember(parsedMember);
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
      setError("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMemberData();
    setRefreshing(false);
  };



  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient colors={['#028758', '#4a008f']} className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <LinearGradient colors={['#028758', '#4a008f']} className="flex-1">
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="p-5">
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={() => router.back()}
                className="p-2"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-xl font-bold ml-2">
                Account Verification
              </Text>
            </View>

            {/* Verification Status */}
            <View className="bg-white rounded-2xl p-6 mb-6">
              <View className="items-center mb-4">
                {member?.contact_verified ? (
                  <View className="items-center">
                    <View className="w-16 h-16 bg-[#028758] rounded-full items-center justify-center mb-4">
                      <Ionicons name="checkmark-circle" size={40} color="white" />
                    </View>
                    <Text className="text-[#028758] text-lg font-bold">Verified Account</Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <View className="w-16 h-16 bg-[#4a008f] rounded-full items-center justify-center mb-4">
                      <Ionicons name="alert-circle" size={40} color="white" />
                    </View>
                    <Text className="text-[#4a008f] text-lg font-bold">Unverified Account</Text>
                  </View>
                )}
              </View>

              <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-600 mb-2">Contact Number:</Text>
                <Text className="text-black text-lg font-semibold">
                  {member?.contact_one || 'Not available'}
                </Text>
              </View>

              {member?.contact_verified ? (
                <View className="space-y-3">
                  <View className="flex-row items-center justify-center bg-[#028758]/10 p-4 rounded-xl">
                    <Ionicons name="shield-checkmark" size={24} color="#028758" />
                    <Text className="text-[#028758] ml-2 font-medium">
                      Your account is fully verified
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-center">
                    You have full access to all features
                  </Text>
                </View>
              ) : (
                <View className="space-y-4">
                  <Text className="text-gray-600 text-center">
                    Your account needs to be verified to access all features
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/verify-phone')}
                    className="bg-[#4a008f] p-4 rounded-full"
                  >
                    <Text className="text-white text-center font-bold">
                      Verify Account
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Benefits />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default VerificationScreen;