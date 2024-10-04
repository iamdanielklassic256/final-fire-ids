import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const CreateMeetingModal = ({ visible, onClose, onSubmit, members, initialData }) => {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    groupId: id,
    agenda: '',
    chaired_by: '',
    scheduled_date: new Date(),
    start_time: new Date(),
    end_time: new Date(),
    summary: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        scheduled_date: new Date(initialData.scheduled_date),
        start_time: new Date(initialData.start_time),
        end_time: new Date(initialData.end_time),
      });
    } else {
      setFormData({
        groupId: id,
        agenda: '',
        chaired_by: '',
        scheduled_date: new Date(),
        start_time: new Date(),
        end_time: new Date(),
        summary: ''
      });
    }
  }, [initialData, id]);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.agenda.trim()) {
      errors.agenda = 'Agenda is required';
    }
    if (!formData.chaired_by) {
      errors.chaired_by = 'Please select who will chair the meeting';
    }
    if (formData.end_time <= formData.start_time) {
      errors.end_time = 'End time must be after start time';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        Alert.alert('Error', 'Failed to save meeting. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>
              {initialData ? 'Update Meeting' : 'Create New Meeting'}
            </Text>
            
            <TextInput
              style={[styles.input, validationErrors.agenda && styles.inputError]}
              placeholder="Agenda"
              value={formData.agenda}
              onChangeText={(text) => handleInputChange('agenda', text)}
              editable={!isSubmitting}
            />
            {validationErrors.agenda && (
              <Text style={styles.errorText}>{validationErrors.agenda}</Text>
            )}
            
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Chaired by:</Text>
              <Picker
                selectedValue={formData.chaired_by}
                style={[styles.picker, validationErrors.chaired_by && styles.pickerError]}
                onValueChange={(itemValue) => handleInputChange('chaired_by', itemValue)}
                enabled={!isSubmitting}
              >
                <Picker.Item label="Select a member" value="" />
                {members.map((member) => (
                  <Picker.Item 
                    key={member.id} 
                    label={member.name} 
                    value={member.id}
                  />
                ))}
              </Picker>
              {validationErrors.chaired_by && (
                <Text style={styles.errorText}>{validationErrors.chaired_by}</Text>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.dateButton, isSubmitting && styles.disabledButton]} 
              onPress={() => setShowDatePicker(true)}
              disabled={isSubmitting}
            >
              <Text>Select Date: {formData.scheduled_date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.scheduled_date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    handleInputChange('scheduled_date', selectedDate);
                  }
                }}
              />
            )}

            <TouchableOpacity 
              style={[styles.dateButton, isSubmitting && styles.disabledButton]}
              onPress={() => setShowStartTimePicker(true)}
              disabled={isSubmitting}
            >
              <Text>Start Time: {formData.start_time.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={formData.start_time}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(false);
                  if (selectedTime) {
                    handleInputChange('start_time', selectedTime);
                  }
                }}
              />
            )}

            <TouchableOpacity 
              style={[styles.dateButton, isSubmitting && styles.disabledButton]}
              onPress={() => setShowEndTimePicker(true)}
              disabled={isSubmitting}
            >
              <Text>End Time: {formData.end_time.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={formData.end_time}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(false);
                  if (selectedTime) {
                    handleInputChange('end_time', selectedTime);
                  }
                }}
              />
            )}

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Summary"
              value={formData.summary}
              onChangeText={(text) => handleInputChange('summary', text)}
              multiline
              editable={!isSubmitting}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.button, 
                  styles.submitButton,
                  isSubmitting && styles.disabledButton
                ]} 
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={[styles.buttonText, styles.loadingText]}>
                      {initialData ? 'Updating...' : 'Creating...'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>
                    {initialData ? 'Update Meeting' : 'Create Meeting'}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red',
  },
  pickerError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red',
  },
  pickerError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default CreateMeetingModal;