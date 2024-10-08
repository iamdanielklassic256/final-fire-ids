import React, { useState, useEffect } from 'react';
import {
  View, Text, Modal, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, FlatList, ActivityIndicator, Animated, Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { all_members_in_a_group, group_transaction_url } from '../../api/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AddDepositModal = ({ walletId, groupId }) => {
  // State variables
  const [isVisible, setIsVisible] = useState(true); // Changed to true by default
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositReason, setDepositReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${all_members_in_a_group}/${groupId}`);
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data.members);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMemberId || !depositAmount || !depositReason) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(group_transaction_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId,
          transType: 'deposit',
          createdBy: selectedMemberId,
          amount: parseFloat(depositAmount),
          reason: depositReason,
        }),
      });

      if (!response.ok) throw new Error('Deposit failed');
      
      Alert.alert('Success', 'Deposit submitted successfully');
      setIsVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to make deposit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMemberId('');
    setDepositAmount('');
    setDepositReason('');
  };

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.memberItem, selectedMemberId === item.id && styles.selectedMemberItem]}
      onPress={() => setSelectedMemberId(item.id)}
    >
      <View style={styles.memberInitials}>
        <Text style={styles.initialsText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      {selectedMemberId === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make a Deposit</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Select Member</Text>
              {isLoading && !members.length ? (
                <ActivityIndicator size="large" color="#ffffff" />
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
                <FlatList
                  data={members}
                  renderItem={renderMemberItem}
                  keyExtractor={(item) => item.id}
                  style={styles.memberList}
                  scrollEnabled={false}
                />
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="cash-outline" size={24} color="#fff" />
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  value={depositAmount}
                  onChangeText={setDepositAmount}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="create-outline" size={24} color="#fff" />
                <TextInput
                  style={styles.input}
                  placeholder="Reason for deposit"
                  placeholderTextColor="#ccc"
                  value={depositReason}
                  onChangeText={setDepositReason}
                  multiline
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!selectedMemberId || !depositAmount || !depositReason || isLoading) && 
                  styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!selectedMemberId || !depositAmount || !depositReason || isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Processing...' : 'Submit Deposit'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  memberList: {
    marginBottom: 15,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  selectedMemberItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  memberInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initialsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberEmail: {
    color: '#ccc',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 15,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(76, 175, 80, 0.5)',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AddDepositModal;