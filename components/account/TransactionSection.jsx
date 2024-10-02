import { View, Text } from 'react-native'
import React, { useState } from 'react'

const TransactionSection = () => {
	const [activeTab, setActiveTab] = useState('transactions');
	if (activeTab === 'transactions') {
		return (
			<FlatList
				data={transactions}
				renderItem={renderTransactionItem}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={styles.listContent}
				ListEmptyComponent={<Text style={styles.noDataText}>No transactions found.</Text>}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				ListHeaderComponent={AccountHeader}
			/>
		);
	} else {
		return (
			<FlatList
				data={moneyRequests}
				renderItem={renderMoneyRequestItem}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={styles.listContent}
				ListEmptyComponent={
					<NoTransaction />
				}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
				ListHeaderComponent={renderHeader}
			/>
		);
	}
}

export default TransactionSection