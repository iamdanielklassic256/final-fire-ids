import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';

const ErrorState = ({error, fetchAllSavingGroups}) => {
  return (
	<View className="flex-1 justify-center items-center p-6">
      <Feather name="alert-triangle" size={64} color="#E53E3E" />
      <Text className="text-2xl font-bold mt-4 text-red-600">Something Went Wrong</Text>
      <Text className="text-center text-gray-600 mt-2">{error}</Text>
      <TouchableOpacity 
        className="bg-blue-500 py-3 px-6 rounded-lg mt-4"
        onPress={fetchAllSavingGroups}
      >
        <Text className="text-white font-bold">Retry</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ErrorState