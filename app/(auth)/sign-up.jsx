import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Loader } from "../../components";
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import axios from 'axios';
import { sign_up_url } from '../../api/api';

const EntityGenderEnum = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
};

const SignUp = () => {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    other_name: "",
    national_identification_number: "",
    contact_one: "",
    contact_two: "",
    email: "",
    personal_identification_number: "",
    date_of_birth: new Date(),
    gender: EntityGenderEnum.MALE,
    pin_needs_reset: true,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prevData => ({ ...prevData, date_of_birth: selectedDate }));
    }
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      Alert.alert("Error", "First name is required");
      return false;
    }
    if (!formData.last_name.trim()) {
      Alert.alert("Error", "Last name is required");
      return false;
    }
    if (!formData.contact_one.trim()) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    const nationalIdRegex = /^[A-Z0-9]{14}$/;
    if (!nationalIdRegex.test(formData.national_identification_number)) {
      Alert.alert("Invalid National ID", "Must be 14 uppercase letters or numbers");
      return false;
    }
    const pinRegex = /^[0-9]{4}$/;
    if (!pinRegex.test(formData.personal_identification_number)) {
      Alert.alert("Invalid PIN", "Must be 4 digits");
      return false;
    }
    if (formData.email && !formData.email.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      const requestData = {
        ...formData,
        date_of_birth: formData.date_of_birth.toISOString().split('T')[0],
        pin_needs_reset: false,
      };
  
      // Handle optional fields
      if (!requestData.other_name?.trim()) delete requestData.other_name;
      if (!requestData.contact_two?.trim()) delete requestData.contact_two;
      if (!requestData.email?.trim()) delete requestData.email;
  
      console.log("Sending data:", requestData);
      
      const response = await axios.post(sign_up_url, requestData);
  
      console.log("Response:", response.data);
      Alert.alert("Success", "Account created successfully!");
      router.push("/sign-in");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View entering={FadeInUp.duration(500)}>
            <View className="mb-4">
              <Text className="text-white mb-2">First Name</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter your first name"
                placeholderTextColor="#ccc"
                value={formData.first_name}
                onChangeText={(text) => handleInputChange("first_name", text)}
              />
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">Last Name</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter your last name"
                placeholderTextColor="#ccc"
                value={formData.last_name}
                onChangeText={(text) => handleInputChange("last_name", text)}
              />
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">Other Name (Optional)</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter your other name"
                placeholderTextColor="#ccc"
                value={formData.other_name}
                onChangeText={(text) => handleInputChange("other_name", text)}
              />
            </View>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={FadeInUp.duration(500)}>
            <View className="mb-4">
              <Text className="text-white mb-2">Email</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter your email"
                placeholderTextColor="#ccc"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                required
              />
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">Phone Number</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter your phone number"
                placeholderTextColor="#ccc"
                value={formData.contact_one}
                onChangeText={(text) => handleInputChange("contact_one", text)}
                keyboardType="phone-pad"
              />
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">Alternative Phone Number (Optional)</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter alternative phone number"
                placeholderTextColor="#ccc"
                value={formData.contact_two}
                onChangeText={(text) => handleInputChange("contact_two", text)}
                keyboardType="phone-pad"
              />
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View entering={FadeInUp.duration(500)}>
            <View className="mb-4">
              <Text className="text-white mb-2">Date of Birth</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-white bg-opacity-20 rounded-lg p-3"
              >
                <Text className="text-black">
                  {formData.date_of_birth.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={formData.date_of_birth}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
            <View className="mb-4">
              <Text className="text-white mb-2">Gender</Text>
              <View className="bg-white bg-opacity-20 rounded-lg">
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(itemValue) => handleInputChange("gender", itemValue)}
                  style={{ color: 'black' }}
                >
                  <Picker.Item label="Male" value={EntityGenderEnum.MALE} />
                  <Picker.Item label="Female" value={EntityGenderEnum.FEMALE} />
                  <Picker.Item label="Other" value={EntityGenderEnum.OTHER} />
                </Picker>
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">National ID Number</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter your National ID Number"
                placeholderTextColor="#ccc"
                value={formData.national_identification_number}
                onChangeText={(text) => handleInputChange("national_identification_number", text)}
              />
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">PIN CODE</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter your Personal Identification Number"
                placeholderTextColor="#ccc"
                value={formData.personal_identification_number}
                onChangeText={(text) => handleInputChange("personal_identification_number", text)}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#028758', '#00E394', '#028758']}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <Animated.View
            entering={FadeInDown.duration(1000)}
            className="bg-[#250048] rounded-3xl p-6 shadow-lg"
          >
            <Text className="text-3xl font-bold text-white text-center mb-2">Join Akiba</Text>
            <Text className="text-lg text-gray-300 text-center mb-8">Create your account to start saving</Text>

            {renderStepContent()}

            <View className="flex-row justify-between mt-6">
              {step > 1 && (
                <TouchableOpacity
                  onPress={prevStep}
                  className="bg-[#250048] py-3 px-6 rounded-full"
                >
                  <Text className="text-white font-bold">Previous</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={nextStep}
                className="bg-[#00E394] py-3 px-6 rounded-lg ml-auto"
              >
                <Text className="text-white font-bold">{step === 3 ? 'Submit' : 'Next'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/sign-in")} className="mt-6">
              <Text className="text-white text-center">Already have an account? Log in</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default SignUp;