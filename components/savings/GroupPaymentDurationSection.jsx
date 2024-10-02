import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from '../Loader';
import { groupid_payment_duration_url, payment_duration_url } from '../../api/api';

const GroupPaymentDurationSection = ({ groupId }) => {
	const [durations, setDurations] = useState([]);
	const [newDuration, setNewDuration] = useState('');
	const [isAdding, setIsAdding] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(0));
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isEmpty, setIsEmpty] = useState(false);

	useEffect(() => {
		console.log('groupId', groupId);
		fetchDurations();
	}, [groupId]);

	const fetchDurations = async () => {
		setIsLoading(true);
		setError(null);
		setIsEmpty(false);
		try {
			const response = await fetch(`${groupid_payment_duration_url}/${groupId}`);
			if (response.ok) {
				const data = await response.json();
				setDurations(data.data);
				setIsEmpty(data.data.length === 0);
			} else if (response.status === 404) {
				const errorData = await response.json();
				console.log('No durations found:', errorData.message);
				setIsEmpty(true);
				setDurations([]);
			} else {
				throw new Error('Failed to fetch payment durations');
			}
		} catch (error) {
			console.error('Error fetching durations:', error);
			setError('Failed to fetch payment durations. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleNewGroupPaymentDuration = async () => {
		if (groupId && newDuration) {
			const newPaymentDuration = { groupId, name: newDuration };
			console.log('hello group', newPaymentDuration);
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch(payment_duration_url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newPaymentDuration),
				});
				if (!response.ok) throw new Error('Failed to create new payment group duration');
				Alert.alert('Success', 'Payment group duration created successfully');
				fetchDurations();
				setNewDuration('');
				setIsAdding(false);
			} catch (error) {
				console.error('Error creating payment group duration:', error);
				setError('Failed to create payment group duration. Please try again.');
			} finally {
				setIsLoading(false);
			}
		}
	};

	const toggleAddForm = () => {
		setIsAdding(prevIsAdding => !prevIsAdding);
		Animated.timing(fadeAnim, {
			toValue: isAdding ? 0 : 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const renderDurationItem = ({ item }) => (
		<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F3E8FF', padding: 12, borderRadius: 8, marginBottom: 8 }}>
			<Text style={{ color: '#5B21B6', fontWeight: '500' }}>{item.name}</Text>
			<MaterialCommunityIcons name="clock-outline" size={20} color="#5B21B6" />
		</View>
	);

	return (
		<View style={{ backgroundColor: 'white', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, padding: 24, marginBottom: 24 }}>
			<Text style={{ fontSize: 20, fontWeight: '600', color: '#5B21B6', marginBottom: 16 }}>Payment Durations</Text>
			{isLoading ? (
				<Loader isLoading={isLoading} />
			) : error ? (
				<View>
					<Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
					<TouchableOpacity onPress={fetchDurations} style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, alignSelf: 'flex-start' }}>
						<Text style={{ color: 'white', fontWeight: 'bold' }}>Retry</Text>
					</TouchableOpacity>
				</View>
			) : (
				<FlatList
					data={durations}
					renderItem={renderDurationItem}
					keyExtractor={(item, index) => index.toString()}
					ListEmptyComponent={
						<Text style={{ color: '#6B7280', fontStyle: 'italic', textAlign: 'center' }}>
							{isEmpty ? "No payment durations set. Add a new duration below." : "Loading durations..."}
						</Text>
					}
				/>
			)}
			<TouchableOpacity
				onPress={toggleAddForm}
				style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, alignSelf: 'flex-start', marginTop: 16 }}
			>
				<Text style={{ color: 'white', fontWeight: 'bold' }}>
					{isAdding ? 'Cancel' : 'Add Duration'}
				</Text>
			</TouchableOpacity>
			{isAdding && (
				<Animated.View style={{ opacity: fadeAnim, marginTop: 16 }}>
					<TextInput
						value={newDuration}
						onChangeText={setNewDuration}
						placeholder="Enter new duration (e.g., Weekly, Monthly)"
						style={{ backgroundColor: '#F3E8FF', borderColor: '#DDD6FE', borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 8 }}
					/>
					
					<TouchableOpacity
						onPress={handleNewGroupPaymentDuration}
						style={{ backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, alignSelf: 'flex-start' }}
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader isLoading={isLoading} />
						) : (
							<Text style={{ color: 'white', fontWeight: 'bold' }}>Save Duration</Text>
						)}
					</TouchableOpacity>
				</Animated.View>
			)}
		</View>
	);
};

export default GroupPaymentDurationSection;