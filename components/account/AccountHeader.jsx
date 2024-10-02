import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AccountHeader = ({ balance }) => (
  <LinearGradient colors={['#00E394', '#00B377']} style={styles.header}>
    <View>
      <Text style={styles.balanceTitle}>Account Balance</Text>
      <Text style={styles.balanceAmount}>UGX {balance.toFixed(2)}</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  balanceTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
});

export default AccountHeader;