import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const DepositModal = ({ isVisible, onClose, onSubmit, wallets, isLoading }) => {
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositReason, setDepositReason] = useState('');



  const handleSubmit = () => {
    onSubmit({
      walletId: selectedWalletId,
      amount: depositAmount,
      reason: depositReason,
    });
  };

  const renderWalletItem = ({ item: wallet }) => (
    <TouchableOpacity
      style={[
        styles.walletItem,
        selectedWalletId === wallet.id && styles.selectedWalletItem
      ]}
      onPress={() => setSelectedWalletId(wallet.id)}
      className="mb-4"
      key={wallet.id}
    >
      <View style={styles.walletHeader}>
        <Text style={styles.walletName}>Wallet for {wallet.group.name}</Text>
        {selectedWalletId === wallet.id && (
          <Ionicons name="checkmark-circle" size={24} color="#00E394" />
        )}
      </View>
        <Text style={styles.walletName}>Goal {wallet.goal}</Text>
      <Text style={styles.walletBalance}>
        Balance: {wallet.group.group_curency} {parseFloat(wallet.total_balance).toFixed(2)}
      </Text>
      <Text style={styles.walletGoal}>
        Goal: {wallet.group.group_curency} {wallet.goal}
      </Text>
      
    </TouchableOpacity>
  );

  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.modalContent}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>Make a Deposit</Text>
            
            <Text style={styles.sectionTitle}>Select a Wallet:</Text>
            <FlatList
              data={wallets}
              renderItem={renderWalletItem}
              keyExtractor={(group) => group.groupName}
              style={styles.groupList}
              scrollEnabled={false}
            />

            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={24} color="#fff" style={styles.inputIcon} />
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
              <Ionicons name="create-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Reason for deposit"
                placeholderTextColor="#ccc"
                value={depositReason}
                onChangeText={setDepositReason}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (!selectedWalletId || !depositAmount || !depositReason) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!selectedWalletId || !depositAmount || !depositReason || isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Processing...' : 'Submit Deposit'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
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
    width: '90%',
    maxHeight: '90%',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  groupList: {
    maxHeight: 400,
  },
  groupContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  groupCurrency: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  walletItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  selectedWalletItem: {
    backgroundColor: 'rgba(0, 227, 148, 0.2)',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  walletName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletBalance: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  walletGoal: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  walletDescription: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 5,
  },
  progressBar: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#00E394',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#00E394',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(0, 227, 148, 0.5)',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DepositModal;