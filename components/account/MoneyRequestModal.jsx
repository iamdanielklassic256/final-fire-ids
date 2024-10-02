import React, { useState, useEffect } from 'react';
import {
	Modal,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { all_savings_groups_by_member_id, groupid_payment_duration_url } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoneyRequestModal = ({ isVisible, onClose, onSubmit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [member, setMember] = useState(null);
	const [groups, setGroups] = useState([]);
	const [durations, setDurations] = useState([]);
	const [error, setError] = useState(null);
	const [isEmpty, setIsEmpty] = useState(false);

	const [selectedGroup, setSelectedGroup] = useState('');
	const [reason, setReason] = useState('');
	const [amountRequested, setAmountRequested] = useState('');
	const [selectedDuration, setSelectedDuration] = useState('');
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [showStartDatePicker, setShowStartDatePicker] = useState(false);
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);

	useEffect(() => {
		fetchMemberData();
	}, []);

	useEffect(() => {
		if (member?.id) {
			fetchAllSavingGroups();
		}
	}, [member]);

	useEffect(() => {
		if (selectedGroup) {
			fetchDurations(selectedGroup);
		}
	}, [selectedGroup]);

	const fetchMemberData = async () => {
		try {
			const memberData = await AsyncStorage.getItem("member");
			if (memberData) {
				const parsedMember = JSON.parse(memberData);
				setMember(parsedMember);
			}
		} catch (error) {
			console.error("Error fetching member data:", error);
			setError("Failed to fetch member data. Please try again.");
		}
	};

	const fetchDurations = async (groupId) => {
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

	const fetchAllSavingGroups = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${all_savings_groups_by_member_id}/${member.id}`);
			if (response.status === 200) {
				const data = await response.json();
				setGroups(data);
			}
		} catch (error) {
			setError('Failed to fetch groups. Please try again later.');
			console.error('Error fetching groups:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (selectedDuration) {
			const durationInDays = parseInt(selectedDuration);
			const newEndDate = new Date(startDate);
			newEndDate.setDate(newEndDate.getDate() + durationInDays);
			setEndDate(newEndDate);
		}
	}, [selectedDuration, startDate]);

	const handleSubmit = () => {
		const requestData = {
			groupId: selectedGroup,
			moneyRequestTypeId: reason,
			requestedBy: member?.id, 
			amount_requested: amountRequested,
			duration_id: selectedDuration,
			start_on: startDate.toISOString(),
			end_on: endDate.toISOString()
		};
		console.log('processing the data', requestData)
		onSubmit(requestData);
	};

	const renderDatePicker = (date, onChange, showPicker, setShowPicker, label) => (
		<View className="mb-4">
			<Text className="text-gray-700 font-semibold mb-2">{label}</Text>
			<TouchableOpacity onPress={() => setShowPicker(true)} className="border border-gray-300 rounded-lg px-4 py-2">
				<Text>{date.toLocaleDateString()}</Text>
			</TouchableOpacity>
			{showPicker && (
				<DateTimePicker
					value={date}
					mode="date"
					display="default"
					onChange={(event, selectedDate) => {
						setShowPicker(false);
						if (selectedDate) {
							onChange(selectedDate);
						}
					}}
				/>
			)}
		</View>
	);

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isVisible}
			onRequestClose={onClose}
		>
			<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
				<ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white p-6 rounded-lg w-11/12 max-h-5/6">
					<Text className="text-2xl font-bold text-center mb-6 text-indigo-600">Make a Money Request</Text>

					<Text className="text-gray-700 font-semibold mb-2">Select Group</Text>
					<Picker
						selectedValue={selectedGroup}
						onValueChange={(itemValue) => setSelectedGroup(itemValue)}
						className="border border-gray-300 rounded-lg mb-4"
					>
						<Picker.Item label="Select a group" value="" />
						{groups.map((group) => (
							<Picker.Item key={group.id} label={group.name} value={group.id} />
						))}
					</Picker>

					<Text className="text-gray-700 font-semibold mb-2">Reason</Text>
					<TextInput
						className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
						placeholder="Enter reason"
						value={reason}
						onChangeText={setReason}
					/>

					<Text className="text-gray-700 font-semibold mb-2">Amount</Text>
					<TextInput
						className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
						placeholder="Enter amount"
						keyboardType="numeric"
						value={amountRequested}
						onChangeText={setAmountRequested}
					/>

					<Text className="text-gray-700 font-semibold mb-2">Duration</Text>
					<Picker
						selectedValue={selectedDuration}
						onValueChange={(itemValue) => setSelectedDuration(itemValue)}
						className="border border-gray-300 rounded-lg mb-4"
					>
						<Picker.Item label="Select a duration" value="" />
						{durations.map((duration) => (
							<Picker.Item key={duration.id} label={duration.name} value={duration.id} />
						))}
					</Picker>

					{renderDatePicker(startDate, setStartDate, showStartDatePicker, setShowStartDatePicker, "Start Date")}
					{renderDatePicker(endDate, setEndDate, showEndDatePicker, setShowEndDatePicker, "End Date")}

					<TouchableOpacity
						className={`bg-indigo-600 text-white font-bold py-3 rounded-lg w-full text-center ${isLoading ? 'opacity-70' : ''
							}`}
						onPress={handleSubmit}
						disabled={isLoading}
					>
						{isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text>Submit Request</Text>}
					</TouchableOpacity>

					<TouchableOpacity className="bg-red-500 text-white font-bold py-3 rounded-lg w-full text-center mt-4" onPress={onClose}>
						<Text>Cancel</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</Modal>
	);
};

export default MoneyRequestModal;