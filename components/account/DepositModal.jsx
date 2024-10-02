import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DepositModal = ({ isVisible, onClose, wallets, onSubmit }) => {
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onSubmit({
      walletId: selectedWalletId,
      amount,
      reason
    });
    resetForm();
  };

  const resetForm = () => {
    setSelectedWalletId('');
    setAmount('');
    setReason('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Make a Deposit</Text>
          <Picker
            selectedValue={selectedWalletId}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedWalletId(itemValue)}
          >
            <Picker.Item label="Select Wallet" value="" />
            {wallets.map((wallet) => (
              <Picker.Item key={wallet.id} label={wallet?.group.name} value={wallet.id} />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Reason"
            value={reason}
            onChangeText={setReason}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
	modalContainer: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	  backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
	  backgroundColor: 'white',
	  padding: 20,
	  borderRadius: 10,
	  width: '80%',
	},
	modalTitle: {
	  fontSize: 18,
	  fontWeight: 'bold',
	  marginBottom: 15,
	  textAlign: 'center',
	},
	picker: {
	  marginBottom: 10,
	},
	input: {
	  borderWidth: 1,
	  borderColor: '#ccc',
	  borderRadius: 5,
	  padding: 10,
	  marginBottom: 10,
	},
	submitButton: {
	  backgroundColor: '#00E394',
	  padding: 10,
	  borderRadius: 5,
	  alignItems: 'center',
	  marginTop: 10,
	},
	submitButtonText: {
	  color: 'white',
	  fontWeight: 'bold',
	},
	cancelButton: {
	  backgroundColor: '#FF3E3E',
	  padding: 10,
	  borderRadius: 5,
	  alignItems: 'center',
	  marginTop: 10,
	},
	cancelButtonText: {
	  color: 'white',
	  fontWeight: 'bold',
	},
  });

export default DepositModal;