import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const WalletHeader = ({ wallet }) => {
  const progress = parseFloat(wallet.total_balance) / parseFloat(wallet.goal);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{wallet.WalletType?.name} Wallet</Text>
        <Text style={styles.groupName}>{wallet.group?.name}</Text>
      </View>

      <View style={styles.card}>
        {/* Header content */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // Styles for the header component
});

export default WalletHeader;