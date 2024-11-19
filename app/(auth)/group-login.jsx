import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { group_login_url } from '../../api/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GROUP_LOGIN_KEY = 'group_login_data';
const LAST_LOGIN_ATTEMPT = 'last_login_attempt';

const GroupLogin = () => {
  const [members, setMembers] = useState([
    { memberId: 0, contact_one: '', personal_identification_number: '' },
    { memberId: 1, contact_one: '', personal_identification_number: '' },
    { memberId: 2, contact_one: '', personal_identification_number: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Load saved phone numbers on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(GROUP_LOGIN_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Only load phone numbers, not PINs for security
        setMembers(prevMembers => prevMembers.map((member, index) => ({
          ...member,
          contact_one: parsedData[index]?.contact_one || ''
        })));
        console.log('Loaded saved phone numbers successfully');
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveLoginData = async (phoneNumbers) => {
    try {
      // Save only phone numbers, not PINs
      await AsyncStorage.setItem(GROUP_LOGIN_KEY, JSON.stringify(phoneNumbers));
      await AsyncStorage.setItem(LAST_LOGIN_ATTEMPT, new Date().toISOString());
      console.log('Saved login data successfully');
    } catch (error) {
      console.error('Error saving login data:', error);
    }
  };

  const handleChange = (text, field, index) => {
    setMembers(prevMembers =>
      prevMembers.map((member, i) =>
        i === index ? { ...member, [field]: text } : member
      )
    );
  };

  const handleForgotPasscode = (index) => {
    Alert.alert(
      "Reset Passcode",
      `A reset link will be sent to the registered phone number for Member ${index + 1}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Link",
          onPress: () => {
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();

            Alert.alert("Link Sent", "Please check your phone for the reset link.");
          }
        }
      ]
    );
  };

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

  const showLoginSuccess = async (response) => {
    console.log('Login successful:', response.data);
    await AsyncStorage.setItem("group_information", JSON.stringify(response.data));
    Alert.alert(
      "Login Successful! 🎉",
      "Welcome back to your group account!\n\nYou now have access to all group features.",
      [
        {
          text: "Continue to Dashboard",
          onPress: () => router.push("/dashboard")
        }
      ]
    );
  };

  const showLoginError = (error) => {
    console.error('Login error details:', error.response?.data || error.message);
    let errorMessage = "Unable to log in the group. ";

    if (error.response?.data?.message) {
      errorMessage += error.response.data.message;
    } else if (error.response?.status === 401) {
      errorMessage += "Invalid credentials. Please check and try again.";
    } else if (error.response?.status === 429) {
      errorMessage += "Too many attempts. Please try again later.";
    } else {
      errorMessage += "Please verify credentials and try again.";
    }

    Alert.alert("Login Failed", errorMessage);
  };

  const handleGroupLogin = async () => {
    console.log('Starting group login process...');

    if (members.some(member => !member.contact_one || !member.personal_identification_number)) {
      console.log('Incomplete member information detected');
      Alert.alert("Incomplete Information", "Please fill in all the phone numbers and PINs for the members.");
      return;
    }

    const formattedData = {
      members: members.map(({ contact_one, personal_identification_number }) => ({
        contact_one: formatPhoneNumber(contact_one),
        personal_identification_number,
      })),
    };

    console.log('Attempting login with formatted data:', {
      ...formattedData,
      members: formattedData.members.map(m => ({ ...m, personal_identification_number: '****' }))
    });

    try {
      setIsLoading(true);
      const response = await axios.post(group_login_url, formattedData);

      if (response.status === 201) {
        // Save phone numbers for future use
        const phoneNumbersOnly = members.map(member => ({
          contact_one: member.contact_one
        }));
        await saveLoginData(phoneNumbersOnly);

        // router.push('/dashboard')

        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();

        showLoginSuccess(response);
      }
    } catch (error) {
      showLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMemberInput = (member, index) => (
    <Animated.View
      key={`member-${index}`}
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
      className={`bg-[#111827] backdrop-blur-lg p-4 rounded-2xl mb-4 ${activeIndex === index ? 'border-2 border-white/30' : ''
        }`}
    >
      <TouchableOpacity
        onPress={() => setExpandedCard(expandedCard === index ? null : index)}
        className="flex-row items-center justify-between mb-2"
      >
        <View className="flex-row items-center">
          <View className="bg-white rounded-full p-2">
            <MaterialCommunityIcons name="account-circle" size={24} color="#028758" />
          </View>
          <Text className="text-white text-lg font-semibold ml-2">
            Member {index + 1}
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="bg-[#028758] px-3 py-1 rounded-full mr-2">
            <Text className="text-white text-sm">{`${index + 1}/3`}</Text>
          </View>
          <FontAwesome5
            name={expandedCard === index ? "chevron-up" : "chevron-down"}
            size={16}
            color="#028758"
          />
        </View>
      </TouchableOpacity>

      {(expandedCard === index || expandedCard === null) && (
        <View className="space-y-3">
          <View className="bg-white/20 rounded-lg p-3 flex-row items-center">
            <Ionicons name="call-outline" size={20} color="white" />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={member.contact_one}
              onChangeText={(text) => handleChange(text, 'contact_one', index)}
              onFocus={() => setActiveIndex(index)}
              keyboardType="phone-pad"
              className="text-white text-base flex-1 ml-2"
            />
          </View>

          <View className="bg-white/20 rounded-lg p-3 flex-row items-center">
            <Ionicons name="key-outline" size={20} color="white" />
            <TextInput
              placeholder="PIN"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={member.personal_identification_number}
              onChangeText={(text) => handleChange(text, 'personal_identification_number', index)}
              onFocus={() => setActiveIndex(index)}
              keyboardType="numeric"
              secureTextEntry
              className="text-white text-base flex-1 ml-2"
            />
          </View>

          <TouchableOpacity
            onPress={() => handleForgotPasscode(index)}
            className="flex-row items-center justify-end"
          >
            <Text className="text-white/80 text-sm">Forgot Passcode?</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#ffffff']}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-6 pt-8">
            <View className="items-center mb-8">
              <View className="w-24 h-24 bg-[#028758] rounded-full mb-4 items-center justify-center overflow-hidden">
                <Image
                  source={require('../../assets/icons/logo/logoname.png')}
                  className="w-20 h-20"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-[#111827] text-3xl font-bold mb-2">Group Access</Text>
              <Text className="text-[#111827] text-base text-center">
                Enter credentials for all three members to proceed
              </Text>
            </View>

            <View className="flex-1">
              {members.map((member, index) => renderMemberInput(member, index))}
            </View>

            <View className="space-y-4 mb-6 mt-4">
              <TouchableOpacity
                onPress={handleGroupLogin}
                disabled={isLoading}
                className={`p-4 rounded-xl ${isLoading ? 'bg-[#028758]' : 'bg-[#028758]'}`}
              >
                {isLoading ? (
                  <View className="flex-row justify-center items-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white text-center text-lg font-bold ml-2">
                      Verifying...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-center text-lg font-bold">
                    ACCESS GROUP
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/sign-in")}
                className="flex-row justify-center items-center p-4"
              >
                <Ionicons name="arrow-back-outline" size={20} color="white" />
                <Text className="text-white text-base ml-2">
                  Back to Individual Login
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default GroupLogin;