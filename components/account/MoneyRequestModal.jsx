import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { all_savings_groups_by_member_id, groupid_payment_duration_url } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoneyRequestModal = ({ isVisible, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [member, setMember] = useState(null);
  const [groups, setGroups] = useState([]);
  const [durations, setDurations] = useState([]);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState('');
  const [reason, setReason] = useState('');
  const [amountRequested, setAmountRequested] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchMemberData();
  }, []);

  useEffect(() => {
    if (member?.id) {
      fetchAllSavingGroups();
    }
  }, [member]);

  useEffect(() => {
    if (selectedGroup) {
      fetchDurations(selectedGroup);
    }
  }, [selectedGroup]);

 

  const fetchMemberData = async () => {
    try {
      const memberData = await AsyncStorage.getItem("member");
      if (memberData) {
        const parsedMember = JSON.parse(memberData);
        setMember(parsedMember);
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
      setError("Failed to fetch member data. Please try again.");
    }
  };

  const fetchDurations = async (groupId) => {
    setIsLoading(true);
    setError(null);
    setIsEmpty(false);
    try {
      const response = await fetch(`${groupid_payment_duration_url}/${groupId}`);
      if (response.ok) {
        const data = await response.json();
        setDurations(data.data);
        setIsEmpty(data.data.length === 0);
      } else if (response.status === 404) {
        const errorData = await response.json();
        console.log('No durations found:', errorData.message);
        setIsEmpty(true);
        setDurations([]);
      } else {
        throw new Error('Failed to fetch payment durations');
      }
    } catch (error) {
      console.error('Error fetching durations:', error);
      setError('Failed to fetch payment durations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSavingGroups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${all_savings_groups_by_member_id}/${member.id}`);
      if (response.status === 200) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      setError('Failed to fetch groups. Please try again later.');
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const requestData = {
      groupId: selectedGroup,
      reason,
      requestedBy: member?.id,
      amount_requested: amountRequested,
      duration_id: selectedDuration,
      start_on: startDate.toISOString(),
      end_on: endDate.toISOString(),
      status: 'pending'
    };
    onSubmit(requestData);
  };

  const renderDatePicker = (date, onChange, showPicker, setShowPicker, label) => (
    <View style={styles.datePickerContainer}>
      <Text style={styles.datePickerLabel}>{label}</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePickerButton}>
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
        />
      )}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView} style={styles.content}>
          <Text style={styles.title}>Make a Money Request</Text>

          <Text style={styles.label}>Select Group</Text>
          <Picker
            selectedValue={selectedGroup}
            onValueChange={(itemValue) => setSelectedGroup(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a group" value="" />
            {groups.map((group) => (
              <Picker.Item key={group.id} label={group.name} value={group.id} />
            ))}
          </Picker>

          <Text style={styles.label}>Reason</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reason"
            value={reason}
            onChangeText={setReason}
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amountRequested}
            onChangeText={setAmountRequested}
          />

          <Text style={styles.label}>Duration</Text>
          <Picker
            selectedValue={selectedDuration}
            onValueChange={(itemValue) => setSelectedDuration(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a duration" value="" />
            {durations.map((duration) => (
              <Picker.Item key={duration.id} label={duration.name} value={duration.id} />
            ))}
          </Picker>

          {renderDatePicker(startDate, setStartDate, showStartDatePicker, setShowStartDatePicker, "Start Date")}
          {renderDatePicker(endDate, setEndDate, showEndDatePicker, setShowEndDatePicker, "End Date")}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Submit Request</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 16,
  },
  content: {
    width: '100%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B46C1',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    marginBottom: 16,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#4A5568',
    marginBottom: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButton: {
    backgroundColor: '#E53E3E',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MoneyRequestModal;