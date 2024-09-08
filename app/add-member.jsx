import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { all_members_url, member_saving_group_url, saving_group_members_url } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Loader } from '../components';


const AddSavingGroup = () => {
  const [member, setMember] = useState([]);
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    memberId: '',
    groupId: '',
    roleId: '',
  });
  const [roleData, setRoleData] = useState({
    name: '',
    description: ''
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

          // Fetch all members
          const all_members_response = await fetch(all_members_url);
          const all_members_data = await all_members_response.json();
          console.log('All members data:', all_members_data);
          if (all_members_data && all_members_data.data) {
            setMembers(all_members_data.data);
          } else {
            setMembers([]);
            console.log('No member data in the response');
          }

          // Fetch groups relating to the current member
          const groupResponse = await fetch(`${member_saving_group_url}/${member.id}`);
          const groupData = await groupResponse.json();
          if (groupData && Array.isArray(groupData)) {
            setGroups(groupData);
          } else {
            setGroups([]);
            console.log('No group data or invalid format');
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

  const handleRoleInputChange = (field, value) => {
    setRoleData({ ...roleData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // First, create the new role
      const roleResponse = await fetch('http://localhost:3000/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!roleResponse.ok) {
        const errorData = await roleResponse.json();
        console.log('Role creation failed:', errorData);
        throw new Error(errorData.message || 'Failed to create role');
      }



      const newRole = await roleResponse.json();

      // Now, create the saving group member with the new role
      const savingGroupMemberData = {
        ...formData,
        roleId: newRole.id,
      };

      const savingGroupMemberResponse = await fetch(saving_group_members_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savingGroupMemberData),
      });

      if (!savingGroupMemberResponse.ok) {
        throw new Error('Failed to create saving group member');
      }

      setFormData({
        memberId: '',
        groupId: '',
        roleId: '',
      });
      setRoleData({
        name: '',
        description: '',
      });
      setIsLoading(false);
      Alert.alert('Success', 'Role and Saving Group Member created successfully');
      router.back();
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to create role and saving group member');
    }
  };

  const renderInput = (key, data, onChange) => (
    <View key={key} style={styles.inputContainer}>
      <Text style={styles.label}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
      <TextInput
        style={styles.input}
        value={data[key]}
        onChangeText={(text) => onChange(key, text)}
        placeholder={`Enter ${key.replace(/_/g, ' ')}`}
        placeholderTextColor="#999"
      />
    </View>
  );

  const renderPicker = (key, items, labelFunction, valueKey) => (
    <View key={key} style={styles.inputContainer}>
      <Text style={styles.label}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
      <Picker
        selectedValue={formData[key]}
        onValueChange={(itemValue) => handleInputChange(key, itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select an option" value="" />
        {items.map((item) => (
          <Picker.Item key={item[valueKey]} label={labelFunction(item)} value={item[valueKey]} />
        ))}
      </Picker>
    </View>
  );

  const getFullMemberName = (member) => {
    const names = [member.first_name, member.last_name, member.other_name].filter(Boolean);
    return names.join(' ');
  };

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
        <Text style={styles.title}>Create New Role and Saving Group Member</Text>

        {/* Role inputs */}
        {renderInput('name', roleData, handleRoleInputChange)}
        {renderInput('description', roleData, handleRoleInputChange)}

        {/* Saving Group Member inputs */}
        {members.length > 0 ? (
          renderPicker('memberId', members, getFullMemberName, 'id')
        ) : (
          <Text>No members available</Text>
        )}
        {groups.length > 0 ? (
          renderPicker('groupId', groups, (group) => group.name, 'id')
        ) : (
          <Text>No groups available</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Role and Add Member</Text>
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