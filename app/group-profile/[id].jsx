import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { saving_group_url } from '../../api/api';
import AkibaHeader from '../../components/AkibaHeader';
import { ScrollView, TextInput } from 'react-native';

const steps = [
  'Basic Information',
  'Shares Details',
  'Loan Details',
];

const GroupProfile = () => {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [groupDetails, setGroupDetails] = useState({
    groupNumber: '',
    groupName: '',
    meetingLocation: '',
    country: '',
    shares: '',
    pricePerShare: '',
    minSharePerMeeting: '',
    maxSharePerMeeting: '',
    maxLoan: '',
  });

  useEffect(() => {
    if (id) fetchGroupDetails();
  }, [id]);

  const fetchGroupDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${saving_group_url}/${id}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGroup(data);
    } catch (error) {
      setError(error.message || 'Failed to fetch group details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setGroupDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = () => {
    const requiredFields = {
      0: ['groupNumber', 'groupName', 'meetingLocation', 'country'],
      1: ['shares', 'pricePerShare', 'minSharePerMeeting', 'maxSharePerMeeting'],
      2: ['maxLoan'],
    };

    const missingFields = requiredFields[currentStep].filter(
      (field) => !groupDetails[field]
    );

    if (missingFields.length > 0) {
      Alert.alert(
        'Validation Error',
        `Please fill in all required fields: ${missingFields.join(', ')}`
      );
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validateStep()) {
      console.log('Submitting group details:', groupDetails);
      Alert.alert('Success', 'Group profile updated successfully!');
      // Add API submission logic here
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-center px-4">{error}</Text>
      </View>
    );
  }

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
  }) => (
    <View className="mb-4 shadow-sm">
      <Text className="text-gray-700 mb-2 font-semibold">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm text-gray-800"
        placeholderTextColor="#a1a1aa"
      />
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 mt-4">
      <AkibaHeader title={group?.name || 'Group Profile'} message="Complete the profile step by step" />
      <ScrollView className="px-4 pt-4">
        <View className="bg-white rounded-lg p-4 shadow-md mb-4">
          <Text className="text-lg font-bold text-center mb-4 text-gray-800">
            Step {currentStep + 1}: {steps[currentStep]}
          </Text>

          {currentStep === 0 && (
            <>
              <InputField
                label="Group Number"
                value={groupDetails.groupNumber}
                onChangeText={(text) => handleInputChange('groupNumber', text)}
                placeholder="Enter unique group identifier"
                keyboardType="text"
              />
              <InputField
                label="Group Name"
                value={groupDetails.groupName}
                onChangeText={(text) => handleInputChange('groupName', text)}
                placeholder="Enter official group name"
              />
              <InputField
                label="Meeting Location"
                value={groupDetails.meetingLocation}
                onChangeText={(text) => handleInputChange('meetingLocation', text)}
                placeholder="Enter meeting location"
              />
              <InputField
                label="Country"
                value={groupDetails.country}
                onChangeText={(text) => handleInputChange('country', text)}
                placeholder="Enter country"
              />
            </>
          )}

          {currentStep === 1 && (
            <>
              <InputField
                label="Total Shares"
                value={groupDetails.shares}
                onChangeText={(text) => handleInputChange('shares', text)}
                placeholder="Enter total shares"
                keyboardType="numeric"
              />
              <InputField
                label="Price per Share"
                value={groupDetails.pricePerShare}
                onChangeText={(text) => handleInputChange('pricePerShare', text)}
                placeholder="Enter price per share"
                keyboardType="numeric"
              />
              <InputField
                label="Minimum Share per Meeting"
                value={groupDetails.minSharePerMeeting}
                onChangeText={(text) => handleInputChange('minSharePerMeeting', text)}
                placeholder="Enter minimum share per meeting"
                keyboardType="numeric"
              />
              <InputField
                label="Maximum Share per Meeting"
                value={groupDetails.maxSharePerMeeting}
                onChangeText={(text) => handleInputChange('maxSharePerMeeting', text)}
                placeholder="Enter maximum share per meeting"
                keyboardType="numeric"
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <InputField
                label="Maximum Loan Amount"
                value={groupDetails.maxLoan}
                onChangeText={(text) => handleInputChange('maxLoan', text)}
                placeholder="Enter maximum loan amount"
                keyboardType="numeric"
              />
            </>
          )}

          <View className="flex-row justify-between mt-4">
            {currentStep > 0 && (
              <TouchableOpacity 
                className="bg-gray-200 rounded-lg p-4 w-[45%]" 
                onPress={prevStep}
              >
                <Text className="text-gray-800 text-center font-semibold">Previous</Text>
              </TouchableOpacity>
            )}

            {currentStep < steps.length - 1 ? (
              <TouchableOpacity 
                className="bg-blue-500 rounded-lg p-4 w-[45%] ml-auto" 
                onPress={nextStep}
              >
                <Text className="text-white text-center font-semibold">Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className="bg-green-500 rounded-lg p-4 w-[45%] ml-auto" 
                onPress={handleSubmit}
              >
                <Text className="text-white text-center font-semibold">Submit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GroupProfile;