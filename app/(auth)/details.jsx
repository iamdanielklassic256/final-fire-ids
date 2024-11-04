import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, Modal, TextInput, Alert, Platform } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { all_members_url } from '../../api/api';
import { GENDER_OPTIONS } from '../../utils/gender'
import DateTimePicker from '@react-native-community/datetimepicker';



const MemberDetails = () => {
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setEditValue(formatDate(selectedDate));
    }
  };


  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      const memberData = await AsyncStorage.getItem("member");
      if (memberData) {
        const parsedMember = JSON.parse(memberData);
        setMember(parsedMember);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not verified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const handleEdit = (field, value) => {
    setEditField(field);
    setEditValue(value || '');
    setEditMode(true);
  };

  const updateMemberField = async () => {
    if (!editField || !editValue) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${all_members_url}/${member.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add any required authorization headers here
        },
        body: JSON.stringify({
          [editField]: editValue
        })
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const updatedData = await response.json();

      // Update local storage and state
      const updatedMember = { ...member, [editField]: editValue };
      await AsyncStorage.setItem("member", JSON.stringify(updatedMember));
      setMember(updatedMember);

      Alert.alert('Success', 'Information updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update information. Please try again.');
      console.error('Update error:', error);
    } finally {
      setIsSaving(false);
      setEditMode(false);
    }
  };

  const EditModal = () => {
    const renderEditField = () => {
      switch (editField) {
        case 'date_of_birth':
          return (
            <View style={styles.datePickerContainer}>
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  style={styles.datePicker}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {formatDate(selectedDate)}
                    </Text>
                    <Feather name="calendar" size={20} color="#4a008f" />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
            </View>
          );

        case 'gender':
          return (
            <View style={styles.genderContainer}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    editValue === option.value && styles.genderOptionSelected,
                  ]}
                  onPress={() => setEditValue(option.value)}
                >
                  <View style={styles.radioContainer}>
                    <View style={styles.radioOuter}>
                      {editValue === option.value && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={[
                      styles.genderOptionText,
                      editValue === option.value && styles.genderOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );

        default:
          return (
            <TextInput
              style={styles.input}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter new ${editField?.replace(/_/g, ' ')}`}
              autoFocus
            />
          );
      }
    };

    return (
      <Modal
        visible={editMode}
        transparent
        animationType="slide"
        onRequestClose={() => setEditMode(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editField?.replace(/_/g, ' ').toUpperCase()}
            </Text>

            {renderEditField()}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditMode(false);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={updateMemberField}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const InfoItem = ({ icon, label, field, value, editable = false }) => (
    <TouchableOpacity
      style={[styles.infoItem, styles.elevatedCard]}
      onPress={() => editable && handleEdit(field, value)}
      activeOpacity={editable ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <Feather name={icon} size={20} color="#4a008f" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'Not provided'}</Text>
      </View>
      {editable && (
        <Feather name="edit-2" size={20} color="#4a008f" />
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a008f" />
        <Text style={styles.loadingText}>Loading member details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <EditModal />
      <Animated.ScrollView style={{ opacity: fadeAnim }}>
        <View style={[styles.header, styles.elevatedCard]}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileInitials}>
              {member?.first_name?.[0]}{member?.last_name?.[0]}
            </Text>
          </View>
          <Text style={styles.name}>
            {`${member?.first_name || ''} ${member?.other_name || ''} ${member?.last_name || ''}`}
          </Text>
          <View style={[styles.verificationBadge,
          { backgroundColor: member?.contact_verified ? '#e8f5e9' : '#fff3e0' }]}>
            <Feather
              name={member?.contact_verified ? "check-circle" : "alert-circle"}
              size={16}
              color={member?.contact_verified ? "#028758" : "#f57c00"}
            />
            <Text style={[styles.verificationText,
            { color: member?.contact_verified ? "#028758" : "#f57c00" }]}>
              {member?.contact_verified ? "Verified Member" : "Unverified Member"}
            </Text>
          </View>
        </View>

        <View style={[styles.section, styles.elevatedCard]}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <InfoItem
            icon="user"
            label="First Name"
            field="first_name"
            value={member?.first_name}
            editable={true}
          />
          <InfoItem
            icon="user"
            label="Other Name"
            field="other_name"
            value={member?.other_name}
            editable={true}
          />
          <InfoItem
            icon="user"
            label="Last Name"
            field="last_name"
            value={member?.last_name}
            editable={true}
          />
          <InfoItem
            icon="credit-card"
            label="National ID"
            field="national_identification_number"
            value={member?.national_identification_number}
            editable={true}
          />
          <InfoItem
            icon="calendar"
            label="Date of Birth"
            field="date_of_birth"
            value={member?.date_of_birth}
            editable={true}
          />
          <InfoItem
            icon="user"
            label="Gender"
            field="gender"
            value={member?.gender}
            editable={true}
          />
        </View>

        <View style={[styles.section, styles.elevatedCard]}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <InfoItem
            icon="phone"
            label="Primary Contact"
            field="contact_one"
            value={member?.contact_one}
            editable={true}
          />
          <InfoItem
            icon="phone"
            label="Secondary Contact"
            field="contact_two"
            value={member?.contact_two}
            editable={true}
          />
          <InfoItem
            icon="mail"
            label="Email"
            field="email"
            value={member?.email}
            editable={true}
          />
        </View>

        <View style={[styles.section, styles.elevatedCard, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          <InfoItem
            icon="clock"
            label="Contact Verified At"
            value={formatDate(member?.contact_one_verified_at)}
          />
          <InfoItem
            icon="check-circle"
            label="Email Verified At"
            value={formatDate(member?.email_verified_at)}
          />
          <InfoItem
            icon="check-square"
            label="NIN Verified At"
            value={formatDate(member?.nin_verified_at)}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#4a008f',
    fontSize: 16,
  },
  elevatedCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    margin: 15,
    marginBottom: 5,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4a008f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#4a008f',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profileInitials: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verificationText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  section: {
    margin: 15,
    marginBottom: 5,
    padding: 15,
  },
  lastSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a008f',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a008f',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    // backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#4a008f',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePicker: {
    height: 200,
    width: '100%',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  genderContainer: {
    marginBottom: 20,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  genderOptionSelected: {
    borderColor: '#4a008f',
    backgroundColor: '#f0e6ff',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a008f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#4a008f',
  },
  genderOptionText: {
    fontSize: 16,
    color: '#333',
  },
  genderOptionTextSelected: {
    color: '#4a008f',
    fontWeight: '500',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a008f',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default MemberDetails;