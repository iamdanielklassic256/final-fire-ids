import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GroupMembersSection = ({ members }) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [memberDetails, setMemberDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch member details from API
  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const memberIds = members.map(member => member.id);
        const fetchDetails = async (id) => {
          const response = await fetch(`https://akiba-sacco-api.onrender.com/members/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch details for member ${id}`);
          }
          return response.json();
        };

        // Fetch details for all member IDs
        const detailsPromises = memberIds.map(id => fetchDetails(id));
        const detailsArray = await Promise.all(detailsPromises);

        // Organize details by id for easy lookup
        const detailsMap = detailsArray.reduce((acc, detail) => {
          acc[detail.id] = detail;
          return acc;
        }, {});

        setMemberDetails(detailsMap);
      } catch (error) {
        console.error('Error fetching member details:', error);
        setError('Failed to fetch member details');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [members]);

  const renderMemberItem = ({ item, index }) => {
    const details = memberDetails[item.id] || {};
    return (
      <TouchableOpacity 
        className={`flex-row items-center p-3 ${index % 2 === 0 ? 'bg-purple-50' : 'bg-white'} rounded-lg mb-2`}
      >
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }} // Placeholder image as no avatar URL in the data
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold text-purple-800">{`${details.first_name || ''} ${details.last_name || ''}`}</Text>
          <Text className="text-gray-600 text-sm">{details.contact_one || 'No contact info'}</Text>
          <Text className="text-gray-600 text-sm">{details.email || 'No email'}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#6b46c1" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <ActivityIndicator size="large" color="#6b46c1" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-xl shadow-md p-6 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-semibold text-purple-800">Group Members</Text>
        <TouchableOpacity 
          onPress={() => setShowAllMembers(!showAllMembers)}
          className="bg-purple-100 px-3 py-1 rounded-full"
        >
          <Text className="text-purple-800 font-medium">
            {showAllMembers ? 'Show Less' : 'Show All'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={showAllMembers ? members : members.slice(0, 3)}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text className="text-gray-500 italic text-center">No members found</Text>
        }
      />
      
      {!showAllMembers && members.length > 3 && (
        <TouchableOpacity 
          onPress={() => setShowAllMembers(true)}
          className="mt-3 items-center"
        >
          <Text className="text-purple-600 font-medium">
            +{members.length - 3} more members
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GroupMembersSection;
