import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FindGroup = () => {
 

  const handleFetchGroupInvitation = () => {
    router.push('/group/invitation');
  };

  return (
    <TouchableOpacity
      className="w-[48%] bg-white rounded-xl shadow-md p-4 items-center"
      onPress={handleFetchGroupInvitation}
    >
      <Icon name="account-group" size={40} color="#028758" />
      <Text className="mt-2 font-semibold text-center">Find Groups</Text>
    </TouchableOpacity>
  );
};



export default FindGroup;