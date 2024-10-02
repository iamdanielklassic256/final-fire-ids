import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Animated, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { all_members_in_a_group } from '../../api/api';

const GroupMembersSection = ({ groupId }) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandAnimation] = useState(new Animated.Value(0));
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${all_members_in_a_group}/${groupId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch group members');
        }
        const data = await response.json();
        setMembers(data.members);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  useEffect(() => {
    Animated.timing(expandAnimation, {
      toValue: showAllMembers ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showAllMembers]);

  const getMemberCount = (members) => {
    return members ? members.length : 0;
  };

  const openMemberDetails = (member) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  const renderMemberItem = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: expandAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [index < 3 ? 1 : 0, 1],
        }),
        transform: [
          {
            translateY: expandAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [index < 3 ? 0 : 50, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity 
        className={`flex-row items-center p-4 ${index % 2 === 0 ? 'bg-purple-50' : 'bg-white'} rounded-lg mb-2 shadow-sm`}
        onPress={() => openMemberDetails(item)}
      >
        <View className="w-12 h-12 bg-purple-200 rounded-full items-center justify-center mr-3">
          <Text className="text-purple-800 font-bold text-lg">{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-purple-800 text-lg">{item.name || ''}</Text>
          <Text className="text-gray-600 text-sm">{item.contact_one || 'No contact info'}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#6b46c1" />
      </TouchableOpacity>
    </Animated.View>
  );

  const MemberDetailsModal = ({ visible, member, onClose }) => {
    if (!member) return null;

    const getRandomColor = () => {
      const colors = ['#FFA07A', '#98FB98', '#87CEFA', '#DDA0DD', '#F0E68C'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const renderDetailItem = (icon, label, value) => (
      <View className="flex-row items-center mb-4">
        <MaterialCommunityIcons name={icon} size={24} color="#6b46c1" />
        <View className="ml-3">
          <Text className="text-gray-600 text-sm">{label}</Text>
          <Text className="text-purple-800 font-semibold">{value || 'N/A'}</Text>
        </View>
      </View>
    );

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl shadow-lg p-6" style={{ maxHeight: '80%' }}>
            <ScrollView>
              <View className="items-center mb-6">
                <View className="w-24 h-24 rounded-full items-center justify-center mb-4" style={{ backgroundColor: getRandomColor() }}>
                  <Text className="text-purple-800 font-bold text-4xl">{member.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text className="text-2xl font-bold text-purple-800">{member.name}</Text>
                <Text className="text-gray-600">Member since {new Date().getFullYear()}</Text>
              </View>

              {renderDetailItem('shield-account', 'Role', member.role)}
              {renderDetailItem('phone', 'Primary Contact', member.contact_one)}
              {renderDetailItem('phone-plus', 'Secondary Contact', member.contact_two)}
              {renderDetailItem('email', 'Email', member.email)}
              {renderDetailItem('map-marker', 'NIN', member.nin)}
              {renderDetailItem('cash', 'Total Savings', `UGX ${(Math.random() * 10000).toFixed(2)}`)}
              {renderDetailItem('piggy-bank', 'Loan Status', Math.random() > 0.5 ? 'Active Loan' : 'No Active Loan')}

              <View className="mt-6">
                <Text className="text-lg font-semibold text-purple-800 mb-2">Recent Activities</Text>
                {[1, 2, 3].map((_, index) => (
                  <View key={index} className="bg-purple-50 p-3 rounded-lg mb-2">
                    <Text className="text-purple-800">
                      {['Made a deposit', 'Requested a loan', 'Attended group meeting'][index]}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={onClose}
              className="bg-purple-600 rounded-full py-3 px-6 mt-6"
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="text-red-500 mt-2 text-center">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-purple-100 px-4 py-2 rounded-full"
          onPress={() => fetchMembers()}
        >
          <Text className="text-purple-800 font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayedMembers = showAllMembers ? members : members?.slice(0, 3);

  return (
    <View className="bg-white rounded-xl shadow-md p-6 mb-6">
      <FlatList
        data={displayedMembers}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View className="items-center py-8">
            <MaterialCommunityIcons name="account-off-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 italic text-center mt-2">No members found</Text>
          </View>
        }
        scrollEnabled={false}
      />
      
      {!showAllMembers && members.length > 3 && (
        <TouchableOpacity 
          onPress={() => setShowAllMembers(true)}
          className="mt-4 items-center bg-purple-50 py-3 rounded-lg"
        >
          <Text className="text-purple-600 font-medium">
            +{members.length - 3} more members
          </Text>
        </TouchableOpacity>
      )}

      <MemberDetailsModal
        visible={modalVisible}
        member={selectedMember}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default GroupMembersSection;