import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router'; // Assuming you're using Expo Router

const FindGroup = () => {
  const router = useRouter();

  const handleFetchGroupInvitation = () => {
    router.push('/group/invitation');
  };

  return (
    <View className="bg-[#028758] p-4 flex-row justify-center items-center mt-6 rounded-lg">
      <TouchableOpacity  
        onPress={handleFetchGroupInvitation}
      >
        <Text className="text-white font-bold">View Group Invitations</Text>
      </TouchableOpacity>
    </View>
  );
};



export default FindGroup;