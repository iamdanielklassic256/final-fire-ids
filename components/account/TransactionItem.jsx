import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import NoTransaction from '../account/NoTransaction'

const TransactionItem = ({ transactions, refreshing, onRefresh }) => (
	<FlatList
	  data={transactions}
	  renderItem={({ item }) => <TransactionItem transaction={item} />}
	  keyExtractor={(item) => item.id.toString()}
	  contentContainerStyle={styles.listContent}
	  ListEmptyComponent={<NoTransaction />}
	  refreshControl={
		<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
	  }
	/>
  );
  
  const styles = StyleSheet.create({
	listContent: {
	  paddingHorizontal: 20,
	},
  });



export default TransactionItem;