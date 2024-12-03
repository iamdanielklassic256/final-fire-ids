import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const MeetingItem = ({ item, onDelete }) => {
  return (
    <View className="flex-row items-center bg-white border-b border-gray-300">
      <TouchableOpacity
        className="flex-1 p-4 flex-row items-center justify-between"
        onPress={() => router.push(`group-meeting/${item.id}`)}
      >
        <View className="flex-1 pr-4">
          <Text className="text-lg font-bold">{item.name}</Text>
          {item.createdAt && (
            <View className="flex-row items-center mt-1">
              <Feather name="calendar" size={14} color="#666" />
              <Text className="ml-2 text-gray-600">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
        <Feather name="chevron-right" size={24} color="#A0AEC0" />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={onDelete} 
        className="bg-red-500 p-2 mx-2 justify-center items-center rounded-full"
      >
        <Feather name="trash-2" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MeetingItem;