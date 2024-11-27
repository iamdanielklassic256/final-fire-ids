import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Picker } from "@react-native-picker/picker";

const InterestMethodPickers = ({loanDetails, handleInputChange}) => {
  return (
	<>
        {/* Main Interest Method Picker */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Interest Calculation Method</Text>
          <Picker
            selectedValue={loanDetails.interate_method}
            onValueChange={(value) => handleInputChange("interate_method", value)}
          >
            <Picker.Item label="Select Method" value="" />
            <Picker.Item label="One-Time" value="one-time" />
            <Picker.Item label="Monthly" value="monthly" />
          </Picker>
        </View>

        {/* One-Time Method Specific Pickers */}
        {loanDetails.interate_method === "one-time" && (
          <>
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">One-Time Interest Method</Text>
              <Picker
                selectedValue={loanDetails.oneTimeInterestMethod}
                onValueChange={(value) => handleInputChange("oneTimeInterestMethod", value)}
              >
                <Picker.Item label="Select Option" value="" />
                <Picker.Item label="Added" value="added" />
                <Picker.Item label="Subtracted" value="subtracted" />
              </Picker>
            </View>
          </>
        )}

        {/* Monthly Method Specific Pickers */}
        {loanDetails.interate_method === "monthly" && (
          <>
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Monthly Interest Method</Text>
              <Picker
                selectedValue={loanDetails.monthlyInterestMethod}
                onValueChange={(value) => handleInputChange("monthlyInterestMethod", value)}
              >
                <Picker.Item label="Select Option" value="" />
                <Picker.Item label="Declining Balance" value="declining" />
                <Picker.Item label="Fixed Rate" value="fixed" />
              </Picker>
            </View>
          </>
        )}

        {/* Interest Rate Input */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Interest Rate (%)</Text>
          <TextInput
            value={loanDetails.interestRate}
            onChangeText={(value) => handleInputChange("interestRate", value)}
            placeholder="Enter Interest Rate"
            keyboardType="numeric"
            className="bg-white border border-gray-300 p-4 rounded-lg"
          />
        </View>
      </>
  )
}

export default InterestMethodPickers