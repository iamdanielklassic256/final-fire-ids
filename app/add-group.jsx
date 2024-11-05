import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saving_group_url } from '../api/api';
import axios from 'axios';

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
    <View style={styles.datePickerContainer}>
      <Text style={styles.datePickerLabel}>{label}</Text>
      <TouchableOpacity
        onPress={() => dateType === 'start_date' ? setShowStartDatePicker(true) : setShowEndDatePicker(true)}
        style={styles.datePickerButton}
      >
        <Text style={styles.datePickerText}>
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
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 200 }}
          >
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Group Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter group name"
                placeholderTextColor="#ccc"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            </View>
            {renderDatePicker('start_date', 'Start Date')}
            {renderDatePicker('end_date', 'End Date')}
          </MotiView>
        );
      case 2:
        return (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 200 }}
          >
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Contribution Frequency</Text>
              <Picker
                selectedValue={formData.contribution_frequency}
                onValueChange={(itemValue) => handleInputChange("contribution_frequency", itemValue)}
                style={styles.pickerInput}
              >
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
              </Picker>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Share Value</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter share value"
                placeholderTextColor="#ccc"
                value={formData.share_value}
                onChangeText={(text) => handleInputChange("share_value", text)}
                keyboardType="numeric"
              />
            </View>
          </MotiView>
        );
      case 3:
        return (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 200 }}
          >
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Interest Rate</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter interest rate"
                placeholderTextColor="#ccc"
                value={formData.interate_rate}
                onChangeText={(text) => handleInputChange("interate_rate", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Minimum Social Fund Contribution</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter minimum contribution"
                placeholderTextColor="#ccc"
                value={formData.min_social_fund_contrib}
                onChangeText={(text) => handleInputChange("min_social_fund_contrib", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Maximum Social Fund Contribution</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter maximum contribution"
                placeholderTextColor="#ccc"
                value={formData.max_social_fund_contrib}
                onChangeText={(text) => handleInputChange("max_social_fund_contrib", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Saving Delay Fine</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter delay fine amount"
                placeholderTextColor="#ccc"
                value={formData.saving_delay_fine}
                onChangeText={(text) => handleInputChange("saving_delay_fine", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Social Fund Delay Time</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter delay time (in days)"
                placeholderTextColor="#ccc"
                value={formData.social_fund_delay_time}
                onChangeText={(text) => handleInputChange("social_fund_delay_time", text)}
                keyboardType="numeric"
              />
            </View>
          </MotiView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} >
      <StatusBar style="light" />
      <LinearGradient
        colors={['#250048', '#1E003A']}
        style={styles.header}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.headerContent}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Saving Group</Text>
        </MotiView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          style={styles.card}
        >
          {renderStepContent()}

          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity
                onPress={prevStep}
                style={styles.button}
              >
                <Text style={styles.buttonText} className="text-white p-1 text-center w-[80px]" >Previous</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={nextStep}
              style={[styles.button, styles.primaryButton]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white p-1 text-center w-[100px]" style={styles.buttonText}>{step === 3 ? 'Create Group' : 'Next'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateSavingGroup;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginTop: 12,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  formInput: {
    height: 56,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#1a1a1a',
  },
  pickerInput: {
    height: 56,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    color: '#1a1a1a',
  },
  datePickerContainer: {
    marginBottom: 24,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  datePickerButton: {
    height: 56,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 18,
    color: '#1a1a1a',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#250048',
    borderRadius: 16,
    paddingVertical: 12,
  }
})