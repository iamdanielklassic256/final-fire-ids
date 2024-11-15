import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, Modal, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import axios from 'axios';
import { sign_up_url } from '../../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import logo from '../../assets/icons/logo/logoname.png';

const EntityGenderEnum = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
};

const ExceptionEnum = {
  phoneNumberTaken: 'Phone Number Taken Already',
  emailTaken: 'Email Already Exist',
  NinTaken: 'NIN Already Exists',
};

const steps = [
  {
    title: "Personal Information",
    subtitle: "Let's start with your basic details",
    icon: "person-outline"
  },
  {
    title: "Contact Details",
    subtitle: "How can we reach you?",
    icon: "mail-outline"
  },
  {
    title: "Identity Verification",
    subtitle: "Help us verify your identity",
    icon: "shield-outline"
  },
  {
    title: "Security Setup",
    subtitle: "Set up your account security",
    icon: "lock-closed-outline"
  }
];

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
    contact_verified: false
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showIOSDatePicker, setShowIOSDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setFormData({ ...formData, [field]: value.toLowerCase() });
    } else {
      setFormData({ ...formData, [field]: value });
    }
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

  const validateForm = () => {
    const currentStepFields = getStepFields(step);
    let isValid = true;
    let errorMessage = '';

    currentStepFields.forEach(field => {
      if (!formData[field] && field !== 'other_name' && field !== 'contact_two') {
        isValid = false;
        errorMessage = `Please fill in all required fields`;
      }
    });

    if (!isValid) {
      Alert.alert("Validation Error", errorMessage);
      return false;
    }

    if (step === 4) {
      const ninValidationResult = validateUgandanNIN(formData.national_identification_number);
      if (ninValidationResult !== true) {
        Alert.alert("Invalid National ID", ninValidationResult);
        return false;
      }

      const pinRegex = /^[0-9]{4}$/;
      if (!pinRegex.test(formData.personal_identification_number)) {
        Alert.alert("Invalid PIN", "PIN must be 4 digits");
        return false;
      }
    }

    return true;
  };

  const validateUgandanNIN = (nin) => {
    const ninRegex = /^(CM|CF)[A-Z0-9]{12}$/;
    if (!nin) return "NIN is required";
    if (nin.length !== 14) return "NIN must be exactly 14 characters long";
    if (!nin.startsWith("CM") && !nin.startsWith("CF")) {
      return "NIN must start with either 'CM' or 'CF'";
    }
    if (!ninRegex.test(nin)) {
      return "Invalid NIN format";
    }
    return true;
  };

  const getStepFields = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return ['first_name', 'last_name', 'other_name'];
      case 2:
        return ['email', 'contact_one', 'contact_two'];
      case 3:
        return ['date_of_birth', 'gender', 'national_identification_number'];
      case 4:
        return ['personal_identification_number'];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        date_of_birth: formData.date_of_birth.toISOString().split('T')[0],
        contact_one: formatPhoneNumber(formData.contact_one),
        pin_needs_reset: false
      };

      if (!requestData.other_name?.trim()) delete requestData.other_name;
      if (!requestData.contact_two?.trim()) delete requestData.contact_two;
      if (!requestData.email?.trim()) delete requestData.email;

      const response = await axios.post(sign_up_url, requestData);
      Alert.alert(
        "Success!",
        "Your account has been created successfully. Please log in to continue.",
        [{ text: "OK", onPress: () => router.push("/sign-in") }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";

      if (errorMessage.includes(ExceptionEnum.phoneNumberTaken)) {
        Alert.alert("Error", "This phone number is already registered");
      } else if (errorMessage.includes(ExceptionEnum.emailTaken)) {
        Alert.alert("Error", "This email is already registered");
      } else if (errorMessage.includes(ExceptionEnum.NinTaken)) {
        Alert.alert("Error", "This National ID Number is already registered");
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, field, placeholder, options = {}) => {
    const {
      keyboardType = 'default',
      maxLength,
      isPassword,
      isOptional = false
    } = options;

    return (
      <View className="mb-4">
        <Text className="text-white text-sm mb-1">
          {label} {!isOptional && <Text className="text-red-400">*</Text>}
        </Text>
        <View className="relative">
          <TextInput
            className="bg-white bg-opacity-20 rounded-lg p-3 text-white"
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={formData[field]}
            onChangeText={(text) => handleInputChange(field, text)}
            keyboardType={keyboardType}
            maxLength={maxLength}
            secureTextEntry={isPassword && !showPassword}
          />
          {isPassword && (
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderStepContent = () => {
    const StepIcon = ({ name }) => (
      <Ionicons name={name} size={32} color="#250048" />
    );

    return (
      <Animated.View
        entering={FadeInUp.duration(500)}
        exiting={FadeOut.duration(200)}
        className="space-y-4"
      >
        <View className="flex-row items-center space-x-4 mb-6">
          <View className="bg-white p-2 rounded-full">
            <StepIcon name={steps[step - 1].icon} />
          </View>
          <View>
            <Text className="text-white text-xl font-bold">{steps[step - 1].title}</Text>
            <Text className="text-gray-300">{steps[step - 1].subtitle}</Text>
          </View>
        </View>

        {step === 1 && (
          <>
            {renderField("First Name", "first_name", "Enter your first name")}
            {renderField("Last Name", "last_name", "Enter your last name")}
            {renderField("Other Name", "other_name", "Enter other name (optional)", { isOptional: true })}
          </>
        )}

        {step === 2 && (
          <>
            {renderField("Email Address", "email", "Enter your email address", { keyboardType: "email-address" })}
            {renderField("Phone Number", "contact_one", "Enter your phone number", { keyboardType: "phone-pad" })}
            {renderField("Alternative Phone", "contact_two", "Enter alternative number (optional)", {
              keyboardType: "phone-pad",
              isOptional: true
            })}
          </>
        )}

        {step === 3 && (
          <>
            <View className="mb-4">
              <Text className="text-white text-sm mb-1">Date of Birth <Text className="text-red-400">*</Text></Text>
              <TouchableOpacity
                onPress={() => setShowIOSDatePicker(true)}
                className="bg-white bg-opacity-20 rounded-lg p-3 flex-row justify-between items-center"
              >
                <Text className="text-white">
                  {formData.date_of_birth.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-white text-sm mb-1">Gender <Text className="text-red-400">*</Text></Text>
              <View className="bg-white bg-opacity-20 rounded-lg">
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  style={{ color: 'white' }}
                >
                  <Picker.Item label="Male" value={EntityGenderEnum.MALE} />
                  <Picker.Item label="Female" value={EntityGenderEnum.FEMALE} />
                  <Picker.Item label="Other" value={EntityGenderEnum.OTHER} />
                </Picker>
              </View>
            </View>

            {renderField("National ID Number", "national_identification_number", "Enter your NIN")}
          </>
        )}

        {step === 4 && (
          <>
            {renderField("PIN Code", "personal_identification_number", "Enter 4-digit PIN", {
              keyboardType: "numeric",
              maxLength: 4,
              isPassword: true
            })}
          </>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#028758', '#016d46', '#028758']}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Animated.View
            entering={FadeInDown.duration(1000)}
            className="flex-1 p-6"
          >
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-36 h-36 bg-white/20 rounded-3xl mb-4 items-center justify-center">
                <Image
                  source={logo}
                  className="w-[120px] h-[120px] rounded-3xl"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-white text-3xl font-bold">Create Account</Text>
              <Text className="text-gray-300 text-lg mt-2">Step {step} of 4</Text>
            </View>

            {/* Progress Indicator */}
            <View className="flex-row justify-between mb-8">
              {[1, 2, 3, 4].map((stepNumber) => (
                <View
                  key={stepNumber}
                  className="flex-1 items-center"
                >
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center ${stepNumber === step
                      ? 'bg-[#250048]'
                      : stepNumber < step
                        ? 'bg-[#250048]'
                        : 'bg-gray-400'
                      }`}
                  >
                    {stepNumber < step ? (
                      <Ionicons name="checkmark" size={16} color="white" />
                    ) : (
                      <Text className="text-white text-xs">{stepNumber}</Text>
                    )}
                  </View>
                  {stepNumber < 4 && (
                    <View
                      className={`h-0.5 w-full absolute top-3 left-1/2 ${stepNumber < step ? 'bg-white' : 'bg-gray-400'
                        }`}
                    />
                  )}
                </View>
              ))}
            </View>

            {renderStepContent()}

            <View className="flex-row justify-between mt-8">
              {step > 1 && (
                <TouchableOpacity
                  onPress={() => setStep(step - 1)}
                  className="bg-gray-600 py-3 px-6 rounded-lg flex-row items-center"
                >
                  <Ionicons name="arrow-back" size={20} color="white" className="mr-2" />
                  <Text className="text-white font-bold">Back</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  if (validateForm()) {
                    if (step < 4) setStep(step + 1);
                    else handleSubmit();
                  }
                }}
                className={`bg-[#250048] flex justify-center text-center py-3 px-6 rounded-lg flex-row items-center ${step === 1 ? 'flex-1' : 'flex-none ml-auto'
                  }`}
              >

                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold mr-2">
                    {step === 4 ? 'Create Account' : 'Continue'}
                  </Text>
                )}

              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mt-8">
              <TouchableOpacity
                onPress={() => router.push("/sign-in")}
                className="bg-[#250048] hover:bg-[#3b1a59] py-3 px-6 rounded-lg flex-1 mr-4 items-center"
              >
                <Text className="text-white font-bold">Personal Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/group-login")}
                className="bg-[#250048] hover:bg-[#3b1a59] py-3 px-6 rounded-lg flex-1 items-center"
              >
                <Text className="text-white font-bold">Group Login</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>

          {showIOSDatePicker && (
            <Modal transparent={true} animationType="slide" visible={showIOSDatePicker}>
              <View className="flex-1 justify-center bg-black bg-opacity-50">
                <View className="bg-white rounded-lg p-4 mx-4">
                  <DateTimePicker
                    value={formData.date_of_birth}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => {
                      setShowIOSDatePicker(false);
                      if (date) {
                        handleInputChange('date_of_birth', date);
                      }
                    }}
                    maximumDate={new Date()}
                  />
                  <TouchableOpacity
                    onPress={() => setShowIOSDatePicker(false)}
                    className="mt-4 p-2 bg-[#00E394] rounded-lg"
                  >
                    <Text className="text-center text-white">Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </ScrollView>
      </LinearGradient>

    </SafeAreaView>
  );
};

export default SignUp;