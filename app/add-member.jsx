import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  Modal,
  FlatList
} from 'react-native';
import { all_members_url, all_savings_groups_by_member_id, role_url, saving_group_members_url } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Loader } from '../components';
import EnhancedLoader from '../utils/EnhancedLoader';

const ROLES = [
  {
    id: 'chairperson',
    name: 'Chairperson',
    description: 'Leads meetings, oversees group activities, and ensures group objectives are met'
  },
  {
    id: 'secretary',
    name: 'Secretary',
    description: 'Maintains records, takes minutes, and handles group documentation'
  },
  {
    id: 'finance',
    name: 'Finance Officer',
    description: 'Manages group finances, tracks contributions, and maintains financial records'
  },
  {
    id: 'treasurer',
    name: 'Treasurer',
    description: 'Safeguards group funds, processes transactions, and presents financial reports'
  },
  {
    id: 'member',
    name: 'Member',
    description: 'Regular group member with voting rights and participation in savings activities'
  },
  {
    id: 'vice_chairperson',
    name: 'Vice Chairperson',
    description: 'Assists chairperson and acts in their absence'
  }
];

const AddSavingGroup = () => {
  const [member, setMember] = useState([]);
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    memberId: '',
    groupId: '',
    roleType: '',  // This will store the selected role type
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading data...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMessage('Fetching members and groups...');
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const member = JSON.parse(memberData);
          setMember(member);

          // Fetch all members
          const all_members_response = await fetch(all_members_url);
          const all_members_data = await all_members_response.json();
          if (all_members_data && all_members_data.data) {
            setMembers(all_members_data.data);
            setFilteredMembers(all_members_data.data);
          }

          // Fetch groups
          setLoadingMessage('Loading available groups...');
          const groupResponse = await fetch(`${all_savings_groups_by_member_id}/${member.id}`);
          const groupData = await groupResponse.json();
          if (groupData && Array.isArray(groupData)) {
            setGroups(groupData);
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

  useEffect(() => {
    if (searchQuery) {
      const filtered = members.filter(member => {
        const fullName = getFullMemberName(member).toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query);
      });
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchQuery, members]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };




  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setFormData({ ...formData, memberId: member.id });
    setShowMemberModal(false);
    setSearchQuery('');
  };

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => handleMemberSelect(item)}
    >
      <Text style={styles.memberName}>{getFullMemberName(item)}</Text>
      {item.phone_number && (
        <Text style={styles.memberDetail}>📱 {item.phone_number}</Text>
      )}
      {item.email && (
        <Text style={styles.memberDetail}>📧 {item.email}</Text>
      )}
    </TouchableOpacity>
  );

  const MemberSearchModal = () => (
    <Modal
      visible={showMemberModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Member</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMemberModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
          </View>

          <FlatList
            data={filteredMembers}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>No members found</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );

  const handleSubmit = async () => {
    try {
      if (!formData.memberId || !formData.groupId || !formData.roleType) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        return;
      }

      setIsLoading(true);
      setLoadingMessage('Creating role...');

      // 1. Create the role first
      const selectedRole = ROLES.find(role => role.id === formData.roleType);
      const roleData = {
        name: selectedRole.name,
        description: selectedRole.description
      };

      const roleResponse = await fetch(role_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!roleResponse.ok) {
        const errorData = await roleResponse.json();
        throw new Error(errorData.message || 'Failed to create role');
      }

      const newRole = await roleResponse.json();

      setLoadingMessage('Adding member to group...');

      // 2. Create the saving group member with the new role ID
      const savingGroupMemberData = {
        memberId: formData.memberId,
        groupId: formData.groupId,
        roleId: newRole.id  // Use the ID from the newly created role
      };

      const savingGroupMemberResponse = await fetch(saving_group_members_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savingGroupMemberData),
      });

      if (!savingGroupMemberResponse.ok) {
        const errorData = await savingGroupMemberResponse.json();
        throw new Error(errorData.message || 'Failed to create saving group member');
      }

      setFormData({
        memberId: '',
        groupId: '',
        roleType: ''
      });

      setIsLoading(false);
      Alert.alert('Success', 'Member successfully added to the saving group');
      router.back();
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to add member to saving group');
    }
  };

  const renderPicker = (key, items, labelFunction, valueKey = 'id') => (
    <View key={key} style={styles.inputContainer}>
      <Text style={styles.label}>
        {key === 'roleType' ? 'ROLE' : key.replace(/([A-Z])/g, ' $1').toUpperCase()}
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData[key]}
          onValueChange={(itemValue) => handleInputChange(key, itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select an option" value="" color="#666" />
          {items.map((item) => (
            <Picker.Item
              key={item[valueKey]}
              label={labelFunction(item)}
              value={item[valueKey]}
              color="#333"
            />
          ))}
        </Picker>
      </View>
      {key === 'roleType' && formData[key] && (
        <Text style={styles.roleDescription}>
          {ROLES.find(role => role.id === formData[key])?.description}
        </Text>
      )}
    </View>
  );

  const getFullMemberName = (member) => {
    const names = [member.first_name, member.last_name, member.other_name].filter(Boolean);
    return names.join(' ');
  };


  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <EnhancedLoader isLoading={isLoading} message={loadingMessage} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add Member to Saving Group</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>MEMBER</Text>
          <TouchableOpacity
            style={styles.memberSelector}
            onPress={() => setShowMemberModal(true)}
          >
            <Text style={selectedMember ? styles.selectedMemberText : styles.memberSelectorPlaceholder}>
              {selectedMember ? getFullMemberName(selectedMember) : 'Select a member'}
            </Text>
          </TouchableOpacity>
        </View>

        {groups.length > 0 ? (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>GROUP</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.groupId}
                onValueChange={(value) => handleInputChange('groupId', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select a group" value="" />
                {groups.map((group) => (
                  <Picker.Item
                    key={group.id}
                    label={group.name}
                    value={group.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>No groups available</Text>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>ROLE</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.roleType}
              onValueChange={(value) => handleInputChange('roleType', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select a role" value="" />
              {ROLES.map((role) => (
                <Picker.Item
                  key={role.id}
                  label={role.name}
                  value={role.id}
                />
              ))}
            </Picker>
          </View>
          {formData.roleType && (
            <Text style={styles.roleDescription}>
              {ROLES.find(role => role.id === formData.roleType)?.description}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!formData.memberId || !formData.groupId || !formData.roleType) && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!formData.memberId || !formData.groupId || !formData.roleType}
        >
          <Text style={styles.buttonText}>Add Member to Group</Text>
        </TouchableOpacity>

        <MemberSearchModal />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#028758',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
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
    color: '#4a008f',
    marginBottom: 5,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 5,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  roleDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: '#028758',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#92B5A8',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#028758',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    backgroundColor: '#F0F4F8',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  memberItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noResultsText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  memberSelector: {
    backgroundColor: '#F0F4F8',
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  memberSelectorPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  selectedMemberText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default AddSavingGroup;