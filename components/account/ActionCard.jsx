import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ActionCard = ({ onDeposit, onWithdraw }) => (
  <View style={styles.cardContainer}>
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity style={styles.actionButton} onPress={onDeposit}>
          <Ionicons name="arrow-up-circle-outline" size={24} color="#00B377" />
          <Text style={styles.actionText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onWithdraw}>
          <Ionicons name="arrow-down-circle-outline" size={24} color="#FF3E3E" />
          <Text style={styles.actionText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginTop: 5,
  },
});

export default ActionCard;