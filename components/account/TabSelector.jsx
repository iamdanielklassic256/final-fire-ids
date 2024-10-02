import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TabSelector = ({ activeTab, onTabChange }) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
      onPress={() => onTabChange('transactions')}
    >
      <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
        Transactions
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'moneyRequests' && styles.activeTab]}
      onPress={() => onTabChange('moneyRequests')}
    >
      <Text style={[styles.tabText, activeTab === 'moneyRequests' && styles.activeTabText]}>
        Money Requests
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#00B377',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeTabText: {
    color: '#FFF',
  },
});

export default TabSelector;6