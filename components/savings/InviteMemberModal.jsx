import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from '../Loader';

const InviteMemberModal = ({
  visible,
  onClose,
  allMembers,
  selectedMemberId,
  setSelectedMemberId,
  handleInvitation,
  isLoading,
  resetForm
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = allMembers.filter((member) => {
    const searchName = member.formattedName.toLowerCase();
    const query = searchQuery.toLowerCase();
    return searchName.includes(query);
  });

  const selectMember = (id) => {
    setSelectedMemberId(id);
  };

  const renderMemberItem = ({ item }) => {
    return (
      <TouchableOpacity
        className={`p-2 border-b ${selectedMemberId === item.id ? 'bg-purple-100' : ''}`}
        onPress={() => selectMember(item.id)}
      >
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="account" size={24} color="gray" />
          <Text className="ml-2 text-lg">{item.formattedName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
  animationType="slide"
  transparent={true}
  visible={visible}
  onRequestClose={resetForm}
>
  <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
    <View className="bg-white p-6 rounded-lg w-11/12 h-4/5">
      <Text className="text-xl font-semibold mb-4">Send Invitation</Text>

      {/* Search Input */}
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="Search members..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Member List */}
      <View className="flex-1">
        {isLoading ? (
          <Text className="text-center p-4">Loading members...</Text>
        ) : (
          <FlatList
            data={filteredMembers}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`p-2 border-b ${selectedMemberId === item.id ? 'bg-purple-100' : ''}`}
                onPress={() => setSelectedMemberId(item.id)}
              >
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="account" size={24} color="gray" />
                  <Text className="ml-2 text-lg">{item.formattedName}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <Text className="text-center text-gray-500">No members found</Text>
            )}
          />
        )}
      </View>

      {/* Action Buttons */}
      <View className="flex flex-row justify-end mt-4">
        <TouchableOpacity
          onPress={resetForm}
          className="bg-gray-300 p-3 rounded-md mr-2"
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleInvitation}
          disabled={!selectedMemberId || isLoading}
          className={`${
            selectedMemberId ? 'bg-purple-500' : 'bg-gray-300'
          } p-3 rounded-md`}
        >
          {isLoading ? (
            <Loader isLoading={isLoading} />
          ) : (
            <Text className="text-white">Send Invitation</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

  );
};

export default InviteMemberModal;
