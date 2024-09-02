import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { saving_group_url, member_saving_cycle_url, member_contrib_freq_url } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Loader } from '../components';

const AddSavingGroup = () => {
  const [member, setMember] = useState("");
  const [savingCycles, setSavingCycles] = useState([]);
  const [contribFreqs, setContribFreqs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    saving_cycle_id: '',
    contrib_freq_id: '',
    group_curency: '',
    share_value: '',
    interate_rate: '',
    min_social_fund_contrib: '',
    max_social_fund_contrib: '',
    saving_delay_fine: '',
    social_fund_delay_time: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const member = JSON.parse(memberData);
          setMember(member);

          // Fetch saving cycles
          const cyclesResponse = await fetch(`${member_saving_cycle_url}/${member.id}`);
          const cyclesText = await cyclesResponse.text();
          if (cyclesText) {
            const cyclesData = JSON.parse(cyclesText);
            setSavingCycles(Array.isArray(cyclesData) ? cyclesData : []);
          } else {
            setSavingCycles([]);
          }

          // Fetch contribution frequencies
          const freqsResponse = await fetch(`${member_contrib_freq_url}/${member.id}`);
          const freqsText = await freqsResponse.text();
          if (freqsText) {
            const freqsData = JSON.parse(freqsText);
            setContribFreqs(Array.isArray(freqsData) ? freqsData : []);
          } else {
            setContribFreqs([]);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const dataInput = {
      ...formData,
      created_by: member.id,
    };

    try {
      setIsLoading(true);
      const response = await fetch(saving_group_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataInput),
      });
      if (response.ok) {
        setFormData({
          name: '',
          saving_cycle_id: '',
          contrib_freq_id: '',
          group_curency: '',
          share_value: '',
          interate_rate: '',
          min_social_fund_contrib: '',
          max_social_fund_contrib: '',
          saving_delay_fine: '',
          social_fund_delay_time: '',
        });
        setIsLoading(false);
        Alert.alert('Group Created Successfully');
        router.push('/saving-group');
      } else {
        throw new Error('Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to create group');
    }
  };

  const renderInput = (key) => (
    <View key={key} style={styles.inputContainer}>
      <Text style={styles.label}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
      <TextInput
        style={styles.input}
        value={formData[key]}
        onChangeText={(text) => handleInputChange(key, text)}
        placeholder={`Enter ${key.replace(/_/g, ' ')}`}
        placeholderTextColor="#999"
      />
    </View>
  );

  const renderPicker = (key, items) => (
    <View key={key} style={styles.inputContainer}>
      <Text style={styles.label}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
      <Picker
        selectedValue={formData[key]}
        onValueChange={(itemValue) => handleInputChange(key, itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select an option" value="" />
        {items.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>
    </View>
  );

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderInput('name')}
        {renderPicker('saving_cycle_id', savingCycles)}
        {renderPicker('contrib_freq_id', contribFreqs)}
        {Object.keys(formData).filter(key => !['name', 'saving_cycle_id', 'contrib_freq_id'].includes(key)).map(key => renderInput(key))}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          {isLoading ? (
            <Loader isLoading={isLoading} />
          ) : (
            <Text style={styles.buttonText}>Create</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 5,
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#BDC3C7',
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddSavingGroup;