import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MoneyRequestItem = ({ item }) => {
  const statusColors = {
    pending: '#FFA500',
    approved: '#4CAF50',
    rejected: '#F44336',
  };

  return (
    <LinearGradient colors={['#F0F0F0', '#E0E0E0']} style={styles.moneyRequestItem}>
      <View style={styles.moneyRequestHeader}>
        <Text style={styles.moneyRequestAmount}>
          <Text style={styles.currencySymbol}>UGX </Text>
          {item.amount.toFixed(2)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.requesterName}>{item.requester}</Text>
      <Text style={styles.moneyRequestDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  moneyRequestItem: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  moneyRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  moneyRequestAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  requesterName: {
    fontSize: 16,
    marginBottom: 5,
  },
  moneyRequestDate: {
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MoneyRequestItem;