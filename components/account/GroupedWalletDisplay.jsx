import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const GroupedWalletDisplay = ({ wallets }) => {
  const groupedWallets = useMemo(() => {
    const groups = {};
    wallets.forEach(wallet => {
      if (!groups[wallet.group.id]) {
        groups[wallet.group.id] = {
          groupName: wallet.group.name,
          groupCurrency: wallet.group.group_curency,
          wallets: [],
          totalBalance: 0
        };
      }
      groups[wallet.group.id].wallets.push(wallet);
      groups[wallet.group.id].totalBalance += parseFloat(wallet.total_balance);
    });
    return Object.values(groups);
  }, [wallets]);

  const renderWalletItem = ({ item: wallet }) => (
    <View style={styles.walletItem}>
      <Text style={styles.walletName}>{wallet.WalletType.name}</Text>
      <Text style={styles.walletInfo}>Goal: {wallet.group.group_curency} {wallet.goal}</Text>
      <Text style={styles.walletInfo}>Balance: {wallet.group.group_curency} {parseFloat(wallet.total_balance).toFixed(2)}</Text>
    </View>
  );

  const renderGroupItem = ({ item: group }) => (
    <View style={styles.groupContainer}>
      <Text style={styles.groupName}>{group.groupName}</Text>
      <FlatList
        data={group.wallets}
        renderItem={renderWalletItem}
        keyExtractor={(wallet) => wallet.id}
      />
      <Text style={styles.groupTotal}>
        Total Balance: {group.groupCurrency} {group.totalBalance.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={groupedWallets}
      renderItem={renderGroupItem}
      keyExtractor={(group) => group.groupName}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupContainer: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  walletItem: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  walletName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  walletInfo: {
    fontSize: 14,
    color: '#666',
  },
  groupTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#007AFF',
  },
});

export default GroupedWalletDisplay;