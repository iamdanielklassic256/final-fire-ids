// TabSelector.js
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const TabSelector = ({ activeTab, setActiveTab }) => (
  <View className="flex flex-row justify-around items-center p-4 bg-white rounded-t-md shadow-md">
    <TouchableOpacity
      onPress={() => setActiveTab('members')}
      className={`p-2 ${activeTab === 'members' ? 'border-b-4 border-purple-500' : ''}`}
    >
      <Text className={`${activeTab === 'members' ? 'text-purple-800' : 'text-gray-500'} text-lg font-semibold`}>
        Group Members
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => setActiveTab('invitations')}
      className={`p-2 ${activeTab === 'invitations' ? 'border-b-4 border-purple-500' : ''}`}
    >
      <Text className={`${activeTab === 'invitations' ? 'text-purple-800' : 'text-gray-500'} text-lg font-semibold`}>
        Invitations
      </Text>
    </TouchableOpacity>
  </View>
);

export default TabSelector;