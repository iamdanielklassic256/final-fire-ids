import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, Modal, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Picker } from '@react-native-picker/picker';
import { Loader } from "../../components";
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import axios from 'axios';
import { sign_up_url } from '../../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
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
  // Add other exception types as needed
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

  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [showIOSDatePicker, setShowIOSDatePicker] = useState(false);

  const handleIOSDateChange = (event, selectedDate) => {
    setShowIOSDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date_of_birth: selectedDate });
      setBirthDay(selectedDate.getDate().toString());
      setBirthMonth(months[selectedDate.getMonth()]);
      setBirthYear(selectedDate.getFullYear().toString());
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 300 }, (_, i) => currentYear - i);

  // const handleInputChange = (field, value) => {
  //   setFormData({ ...formData, [field]: value });
  // };

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setFormData({ ...formData, [field]: value.toLowerCase() });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const validateDateOfBirth = () => {
    const day = parseInt(birthDay, 10);
    const month = months.indexOf(birthMonth);
    const year = parseInt(birthYear, 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      Alert.alert("Invalid Date", "Please enter a valid date of birth");
      return false;
    }

    const date = new Date(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      Alert.alert("Invalid Date", "Please enter a valid date of birth");
      return false;
    }

    setFormData({ ...formData, date_of_birth: date });
    return true;
  };

  // const validateUgandanNIN = (nin) => {
  //   const ninRegex = /^[A-Z]{2}\d{7}[A-Z]{3}\d[A-Z]$/;
  //   return ninRegex.test(nin);
  // };
  const validateUgandanNIN = (nin) => {
    // Regex pattern: starts with "CM" or "CF", followed by 12 characters (letters or numbers)
    const ninRegex = /^(CM|CF)[A-Z0-9]{12}$/;

    if (!nin) {
      return "NIN is required";
    }

    if (nin.length !== 14) {
      return "NIN must be exactly 14 characters long";
    }

    if (!nin.startsWith("CM") && !nin.startsWith("CF")) {
      return "NIN must start with either 'CM' or 'CF'";
    }

    if (!ninRegex.test(nin)) {
      return "NIN must consist of 'CM' or 'CF' followed by 12 uppercase letters or numbers";
    }

    return true; // NIN is valid
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
    const ninValidationResult = validateUgandanNIN(formData.national_identification_number);
    if (ninValidationResult !== true) {
      Alert.alert("Invalid National ID", ninValidationResult);
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
    if (!validateForm() || !validateDateOfBirth()) return;

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        date_of_birth: formData.date_of_birth.toISOString().split('T')[0],
        pin_needs_reset: false,
      };

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

      const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";

      if (errorMessage.includes(ExceptionEnum.phoneNumberTaken)) {
        Alert.alert("Error", "This phone number is already registered. Please use a different number.");
      } else if (errorMessage.includes(ExceptionEnum.emailTaken)) {
        Alert.alert("Error", "This email is already registered. Please use a different email.");
      } else if (errorMessage.includes(ExceptionEnum.NinTaken)) {
        Alert.alert("Error", "This National ID Number (NIN) is already registered. Please use a different NIN or contact support if you believe this is an error.");
      } else {
        Alert.alert("Error", errorMessage);
      }

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


  const renderDateOfBirth = () => {
    if (Platform.OS === 'ios') {
      return (
        <View className="mb-4">
          <Text className="text-white mb-2">Date of Birth</Text>
          <TouchableOpacity
            onPress={() => {
              console.log("Opening date picker");
              setShowIOSDatePicker(true);
            }}
            className="bg-white bg-opacity-20 rounded-lg p-4 flex-row justify-between items-center"
          >
            <Text className="text-white text-lg">
              {formData.date_of_birth.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
          <Modal
            transparent={true}
            animationType="slide"
            visible={showIOSDatePicker}
            onRequestClose={() => {
              console.log("Closing date picker");
              setShowIOSDatePicker(false);
            }}
          >
            <View className="flex-1 justify-end bg-black bg-opacity-50">
              <View className="bg-white rounded-t-3xl p-6">
                <Text className="text-2xl font-bold text-center text-[#250048] mb-4">
                  Select Your Birthday
                </Text>
                <DateTimePicker
                  value={formData.date_of_birth}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    console.log("Date changed:", selectedDate);
                    handleIOSDateChange(event, selectedDate);
                  }}
                  textColor="#250048"
                />
                <TouchableOpacity
                  onPress={() => {
                    console.log("Confirming date");
                    setShowIOSDatePicker(false);
                  }}
                  className="bg-[#00E394] py-3 px-6 rounded-full mt-4 self-end"
                >
                  <Text className="text-white font-bold">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    } else {
      return (
        <View className="mb-4">
          <Text className="text-white mb-2">Date of Birth</Text>
          <View className="flex-row justify-between">
            <View className="w-1/4">
              <TextInput
                className="bg-white bg-opacity-20 rounded-l-lg p-3 text-black"
                placeholder="Day"
                placeholderTextColor="#000"
                value={birthDay}
                onChangeText={setBirthDay}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View className="w-2/5">
              <Picker
                selectedValue={birthMonth}
                onValueChange={(itemValue) => setBirthMonth(itemValue)}
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                <Picker.Item label="Month" value="" />
                {months.map((month, index) => (
                  <Picker.Item key={index} label={month} value={month} />
                ))}
              </Picker>
            </View>
            <View className="w-1/3">
              <Picker
                selectedValue={birthYear}
                onValueChange={(itemValue) => setBirthYear(itemValue)}
                style={{ backgroundColor: '#fff', color: '#000' }}
                className="rounded-l-lg"
              >
                <Picker.Item label="Year" value="" />
                {years.map((year, index) => (
                  <Picker.Item key={index} label={year.toString()} value={year.toString()} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      );
    }
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
            {renderDateOfBirth()}
            {/* <View className="mb-4">
              <Text className="text-white mb-2">Date of Birth</Text>
              <View className="flex-row justify-between">
                <View className="w-1/4">
                  <TextInput
                    className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                    placeholder="Day"
                    placeholderTextColor="#ccc"
                    value={birthDay}
                    onChangeText={setBirthDay}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
                <View className="w-2/5">
                  <Picker
                    selectedValue={birthMonth}
                    onValueChange={(itemValue) => setBirthMonth(itemValue)}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'black' }}
                  >
                    <Picker.Item label="Month" value="" />
                    {months.map((month, index) => (
                      <Picker.Item key={index} label={month} value={month} />
                    ))}
                  </Picker>
                </View>
                <View className="w-1/3">
                  <Picker
                    selectedValue={birthYear}
                    onValueChange={(itemValue) => setBirthYear(itemValue)}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'black' }}
                  >
                    <Picker.Item label="Year" value="" />
                    {years.map((year, index) => (
                      <Picker.Item key={index} label={year.toString()} value={year.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View> */}
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
            <View className="items-center mb-10">
              <Image
                source={logo}
                className="w-32 h-32 rounded-full mb-6"
                resizeMode="contain"
              />
            </View>
            {/* <Text className="text-3xl font-bold text-white text-center mb-2">Join Akiba</Text> */}
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
                {loading ? (
                  <View className="flex-row justify-center items-center">
                    <ActivityIndicator size="small" color="#ffffff" />
                  </View>
                ) : (
                  <Text className="text-white font-bold">{step === 3 ? 'Submit' : 'Next'}</Text>
                )}

              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/sign-in")} className="mt-6">
              <Text className="text-white text-center">Already have an account? Log in</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
      {loading && <ActivityIndicator size="small" color="#ffffff" />}
    </SafeAreaView>
  );
};

export default SignUp;