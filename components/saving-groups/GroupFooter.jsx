import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const GroupFooter = ({editMode, handleEdit, handleSave, handleCancel}) => {
  return (
	<View className="flex-row justify-around mt-4 mb-6">
        {editMode ? (
          <>
            <TouchableOpacity onPress={handleSave} className="bg-green-500 px-6 py-2 rounded-full">
              <Text className="text-white font-bold">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} className="bg-red-500 px-6 py-2 rounded-full">
              <Text className="text-white font-bold">Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={handleEdit} className="bg-purple-500 px-6 py-2 rounded-full">
            <Text className="text-white font-bold">Edit</Text>
          </TouchableOpacity>
        )}
      </View>
  )
}

export default GroupFooter