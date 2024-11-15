import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { group_login_url } from '../../api/api'; // Make sure to define the API endpoint
import axios from 'axios';

const { width } = Dimensions.get('window');

const GroupLogin = () => {
  const [members, setMembers] = useState([
    { phoneNumber: '', pin: '', memberId: 1 },
    { phoneNumber: '', pin: '', memberId: 2 },
    { phoneNumber: '', pin: '', memberId: 3 },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (text, field, memberId) => {
    setMembers(prevState => prevState.map(member =>
      member.memberId === memberId ? { ...member, [field]: text } : member
    ));
  };

  const handleGroupLogin = async () => {
    if (members.some(member => !member.phoneNumber || !member.pin)) {
      Alert.alert("Please fill in all the phone numbers and PINs for the members.");
      return;
    }

    try {
      setIsLoading(true);

      // Format and send login request
      const response = await axios.post(group_login_url, { members });

      if (response.status === 200) {
        Alert.alert("Success", "Group logged in successfully!", [
          { text: "OK", onPress: () => router.push("/dashboard") }, // Navigate to the dashboard or another screen
        ]);
      }
    } catch (error) {
      console.error('Group login error:', error);
      Alert.alert("Error", "Failed to log in the group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <LinearGradient colors={['#028758', '#00E394', '#028758']} className="flex-1 justify-between p-5">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-center">
          <View className="items-center mb-10">
            <View className="w-36 h-36 bg-white/20 rounded-3xl mb-4 items-center justify-center">
              <Image source={require('../../assets/icons/logo/logoname.png')} className="w-[120px] h-[120px] rounded-3xl" resizeMode="contain" />
            </View>
            <Text className="text-white text-3xl font-bold">Group Login</Text>
            <Text className="text-[#250048] text-base font-bold text-center mt-2.5">Enter each member's phone number and PIN</Text>
          </View>

          <View className="space-y-4">
            {members.map((member) => (
              <View key={member.memberId} className="space-y-4">
                <View className="bg-white rounded-lg p-3 flex-row items-center">
                  <Ionicons name="call-outline" size={24} color="#250048" />
                  <TextInput
                    placeholder={`Member ${member.memberId} Phone Number`}
                    placeholderTextColor="#000000"
                    value={member.phoneNumber}
                    onChangeText={(text) => handleChange(text, 'phoneNumber', member.memberId)}
                    keyboardType="phone-pad"
                    className="text-[#000000] text-base flex-1 ml-2"
                  />
                </View>
                <View className="bg-white rounded-lg p-3 flex-row items-center">
                  <Ionicons name="key-outline" size={24} color="#250048" />
                  <TextInput
                    placeholder={`Member ${member.memberId} PIN`}
                    placeholderTextColor="#000000"
                    value={member.pin}
                    onChangeText={(text) => handleChange(text, 'pin', member.memberId)}
                    keyboardType="numeric"
                    secureTextEntry
                    className="text-[#000000] text-base flex-1 ml-2"
                  />
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={handleGroupLogin} disabled={isLoading} className={`mt-8 p-4 rounded-full ${isLoading ? 'bg-[#4a008f]' : 'bg-[#250048]'}`}>
            {isLoading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="text-[#ffffff] text-center text-lg font-bold ml-2">Logging in...</Text>
              </View>
            ) : (
              <Text className="text-[#ffffff] text-center text-lg font-bold">LOGIN GROUP</Text>
            )}
          </TouchableOpacity>

          <View className="mt-6 space-y-4">
            <TouchableOpacity
              onPress={() => router.push("/sign-in")}
              className="flex-row justify-center items-center bg-white/20 p-4 rounded-full"
            >
              <Ionicons name="arrow-back-outline" size={20} color="white" />
              <Text className="text-white text-base ml-2">Back to Personal Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default GroupLogin;
