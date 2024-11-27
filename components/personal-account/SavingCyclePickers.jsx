import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const SavingCyclePickers = ({ savingCycleDetails, handleInputChange, showStartDatePicker, setShowStartDatePicker, showShareoutDatePicker, setShowShareoutDatePicker }) => {
	return (
		<>
			<View className="mb-4">
				<Text className="text-gray-700 font-medium mb-2">Saving Cycle Method</Text>
				<Picker
					selectedValue={savingCycleDetails.saving_cycle_method}
					onValueChange={(value) => handleInputChange("saving_cycle_method", value)}
				>
					<Picker.Item label="Select Cycle Method" value="" />
					<Picker.Item label="Daily" value="daily" />
					<Picker.Item label="Biweekly" value="biweekly" />
					<Picker.Item label="Weekly" value="weekly" />
					<Picker.Item label="Monthly" value="monthly" />
				</Picker>
			</View>

			<View className="mb-4">
				<Text className="text-gray-700 font-medium mb-2">Saving Cycle Start Day</Text>
				<Picker
					selectedValue={savingCycleDetails.saving_starting_day}
					onValueChange={(value) => {
						handleInputChange("saving_starting_day", value);
						// setDayToClosestDate(value); // Adjust dates based on the selected start day
					}}
				>
					<Picker.Item label="Select Day" value="" />
					{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
						<Picker.Item key={index} label={day} value={day} />
					))}
				</Picker>
			</View>

			<View className="mb-4">
				<Text className="text-gray-700 font-medium mb-2">Start Date</Text>
				<TouchableOpacity onPress={() => setShowStartDatePicker(true)} className={`bg-white border ${savingCycleDetails.start_date.toLocaleDateString() === savingCycleDetails.saving_starting_day ? 'bg-green-300' : 'border-gray-300'} p-4 rounded-lg`}>
					<Text>{savingCycleDetails.start_date.toLocaleDateString()}</Text>
				</TouchableOpacity>
				{showStartDatePicker && (
					<DateTimePicker
						value={savingCycleDetails.start_date}
						mode="date"
						onChange={(event, selectedDate) => {
							if (selectedDate) {
								handleInputChange("start_date", selectedDate);
							}
							setShowStartDatePicker(false);
						}}
					/>
				)}
			</View>

			<View className="mb-4">
				<Text className="text-gray-700 font-medium mb-2">Shareout Date</Text>
				<TouchableOpacity onPress={() => setShowShareoutDatePicker(true)} className={`bg-white border ${savingCycleDetails.shareout_date.toLocaleDateString() === savingCycleDetails.saving_starting_day ? 'bg-green-300' : 'border-gray-300'} p-4 rounded-lg`}>
					<Text>{savingCycleDetails.shareout_date.toLocaleDateString()}</Text>
				</TouchableOpacity>
				{showShareoutDatePicker && (
					<DateTimePicker
						value={savingCycleDetails.shareout_date}
						mode="date"
						onChange={(event, selectedDate) => {
							if (selectedDate) {
								handleInputChange("shareout_date", selectedDate);
							}
							setShowShareoutDatePicker(false);
						}}
					/>
				)}
			</View>
		</>
	)
}

export default SavingCyclePickers