import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, Modal, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saving_group_url } from '../api/api';

const CreateSavingGroup = () => {
  const [formData, setFormData] = useState({
    name: '',
    start_date: new Date(),
    end_date: new Date(),
    contribution_frequency: 'daily',
    group_curency: 'UGX',
    share_value: '',
    interate_rate: '',
    min_social_fund_contrib: '',
    max_social_fund_contrib: '',
    saving_delay_fine: '',
    social_fund_delay_time: '',
  });

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          setMember(JSON.parse(memberData));
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        Alert.alert("Error", "Failed to fetch member data");
      }
    };

    fetchMemberData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event, selectedDate, dateType) => {
    const currentDate = selectedDate || formData[dateType];
    setFormData({ ...formData, [dateType]: currentDate });
    if (dateType === 'start_date') {
      setShowStartDatePicker(false);
    } else {
      setShowEndDatePicker(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Group name is required");
      return false;
    }
    if (!formData.share_value.trim()) {
      Alert.alert("Error", "Share value is required");
      return false;
    }
    if (!formData.interate_rate.trim()) {
      Alert.alert("Error", "Interest rate is required");
      return false;
    }
    // Add more validations as needed
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        start_date: formData.start_date.toISOString().split('T')[0],
        end_date: formData.end_date.toISOString().split('T')[0],
        created_by: member.id,
      };

      console.log("Sending data:", requestData);

      const response = await axios.post(saving_group_url, requestData);

      console.log("Response:", response.data);
      Alert.alert("Success", "Saving group created successfully!");
      router.back();
    } catch (error) {
      console.error("Group creation error:", error.response?.data || error);
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

  const renderDatePicker = (dateType, label) => (
    <View className="mb-4">
      <Text className="text-white mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => dateType === 'start_date' ? setShowStartDatePicker(true) : setShowEndDatePicker(true)}
        className="bg-white bg-opacity-20 rounded-lg p-4 flex-row justify-between items-center"
      >
        <Text className="text-black text-lg">
          {formData[dateType].toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <Ionicons name="calendar-outline" size={24} color="white" />
      </TouchableOpacity>
      {((dateType === 'start_date' && showStartDatePicker) || (dateType === 'end_date' && showEndDatePicker)) && (
        <DateTimePicker
          value={formData[dateType]}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, dateType)}
        />
      )}
    </View>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View entering={FadeInUp.duration(500)}>
            <View className="mb-4">
              <Text className="text-white mb-2">Group Name</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter group name"
                placeholderTextColor="#000000"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            </View>
            {renderDatePicker('start_date', 'Start Date')}
            {renderDatePicker('end_date', 'End Date')}
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={FadeInUp.duration(500)}>
            <View className="mb-4">
              <Text className="text-white mb-2">Contribution Frequency</Text>
              <View className="bg-white bg-opacity-20 rounded-lg">
                <Picker
                  selectedValue={formData.contribution_frequency}
                  onValueChange={(itemValue) => handleInputChange("contribution_frequency", itemValue)}
                  style={{ color: 'black' }}
                >
                  <Picker.Item label="Daily" value="daily" />
                  <Picker.Item label="Weekly" value="weekly" />
                  <Picker.Item label="Monthly" value="monthly" />
                </Picker>
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">Share Value</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter share value"
                placeholderTextColor="#ccc"
                value={formData.share_value}
                onChangeText={(text) => handleInputChange("share_value", text)}
                keyboardType="numeric"
              />
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View entering={FadeInUp.duration(500)}>
            <View className="mb-4">
              <Text className="text-white mb-2">Interest Rate</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter interest rate"
                placeholderTextColor="#ccc"
                value={formData.interate_rate}
                onChangeText={(text) => handleInputChange("interate_rate", text)}
                keyboardType="numeric"
              />
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">Minimum Social Fund Contribution</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter minimum contribution"
                placeholderTextColor="#ccc"
                value={formData.min_social_fund_contrib}
                onChangeText={(text) => handleInputChange("min_social_fund_contrib", text)}
                keyboardType="numeric"
              />
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">Maximum Social Fund Contribution</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter maximum contribution"
                placeholderTextColor="#ccc"
                value={formData.max_social_fund_contrib}
                onChangeText={(text) => handleInputChange("max_social_fund_contrib", text)}
                keyboardType="numeric"
              />
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">Saving Delay Fine</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter delay fine amount"
                placeholderTextColor="#ccc"
                value={formData.saving_delay_fine}
                onChangeText={(text) => handleInputChange("saving_delay_fine", text)}
                keyboardType="numeric"
              />
            </View>
            <View className="mb-4">
              <Text className="text-white mb-2">Social Fund Delay Time</Text>
              <TextInput
                className="bg-white bg-opacity-20 rounded-lg p-3 text-black"
                placeholder="Enter delay time (in days)"
                placeholderTextColor="#ccc"
                value={formData.social_fund_delay_time}
                onChangeText={(text) => handleInputChange("social_fund_delay_time", text)}
                keyboardType="numeric"
              />
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-400">
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <Animated.View
          entering={FadeInDown.duration(1000)}
          className="bg-[#250048] rounded-xl p-6 shadow-lg"
        >
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
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-bold">{step === 3 ? 'Create Group' : 'Next'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateSavingGroup;