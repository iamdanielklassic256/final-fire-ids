import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  group_invitation_url, 
  saving_group_members_url,
  role_url 
} from '../../api/api';
import Loader from '../../components/Loader';

const Invitations = () => {
  const [member, setMember] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemberData();
  }, []);

  useEffect(() => {
    if (member?.id) {
      fetchGroupInvitations();
    }
  }, [member]);

  const fetchMemberData = async () => {
    try {
      const memberData = await AsyncStorage.getItem("member");
      if (memberData) {
        const memberId = JSON.parse(memberData);
        setMember(memberId);
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
      setError("Failed to load member data");
    }
  };

  const fetchGroupInvitations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${group_invitation_url}/member/${member.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInvitations(data?.data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      setError("Failed to fetch invitations");
      Alert.alert(
        "Error",
        "Failed to fetch invitations. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitation = async (invitation, status) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${group_invitation_url}/${invitation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedInvitation = await response.json();

      // Update local state
      setInvitations(prevInvitations => 
        prevInvitations.filter(inv => inv.id !== invitation.id)
      );
      
      Alert.alert(
        "Success",
        status === 'approved' 
          ? "You've successfully joined the group!"
          : "Invitation declined successfully.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error handling invitation:', error);
      Alert.alert(
        "Error",
        `Failed to ${status.toLowerCase()} invitation. Please try again later.`,
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const invitedGroup = item.group;
    return (
      <View className="bg-white rounded-lg shadow-md m-2 p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-gray-800">{invitedGroup.name}</Text>
          <View className="bg-blue-100 px-2 py-1 rounded">
            <Text className="text-blue-800 text-sm">Pending</Text>
          </View>
        </View>
        
        <Text className="text-gray-600 mb-4">
          You've been invited to join this group. Would you like to accept?
        </Text>
        
        <View className="flex-row justify-between">
          <TouchableOpacity 
            onPress={() => handleInvitation(item, 'approved')}
            className="bg-green-500 px-6 py-2 rounded-full flex-1 mr-2"
          >
            <Text className="text-white text-center font-semibold">Accept</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleInvitation(item, 'rejected')}
            className="bg-red-500 px-6 py-2 rounded-full flex-1 ml-2"
          >
            <Text className="text-white text-center font-semibold">Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <Loader isLoading={isLoading}/>;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Text className="text-2xl font-bold p-4 text-gray-800">Group Invitations</Text>
      <FlatList
        data={invitations}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-lg text-gray-500 text-center">
              No pending invitations at the moment.
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              When someone invites you to a group, it will appear here.
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Invitations