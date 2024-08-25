import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { saving_group_url } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddSavingGroup = () => {
  const [member, setMember] = useState("");

	useEffect(() => {
		const fetchMemberData = async () => {
			try {
				const memberData = await AsyncStorage.getItem("member");
				if (memberData) {
					const member = JSON.parse(memberData);
					setMember(member);
				}
			} catch (error) {
				console.error("Error fetching member data:", error);
			}
		};

		fetchMemberData();
	}, []);




  const memberId = member.id

  console.log("AddSavingGroup", memberId)
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


  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async() => {
    console.log('Submitting form data:', formData);
    // Add your API call or state management logic here
    const dataInput = {
      created_by,
      ...formData,
    }
    try {
      setIsLoading(true);
      const response = await fetch(saving_group_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataInput),
      });
      if (!response.ok) {
        throw new Error('Failed to create cycle');
      }
      // fetch(); // Refresh the list after creating a new cycle
     setFormData("")
     setIsLoading(false)
     console.log('++++++data content++++++', response.data)
     Alert.alert('Group Created Successfully')
    } catch (error) {
      console.error('Error creating cycle:', error);
      setIsLoading(false)
      // You might want to show an error message to the user here
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {Object.keys(formData).map(key => renderInput(key))}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Saving Group</Text>
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