import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { saving_group_url } from '../../api/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Confetti from 'react-native-confetti';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GroupMembersSection from '../../components/savings/members';
import GroupPaymentDurationSection from '../../components/savings/GroupPaymentDurationSection';
import GroupInvitation from '../../components/savings/GroupInvitation';
import GroupJoinRequests from '../../components/savings/GroupJoinRequests';
import TabBar from '../../components/saving-groups/TabBar';
import EditableInfoItem from '../../components/saving-groups/EditableInfoItem';
import FinancialCard from '../../components/saving-groups/FinancialCard';

const { width } = Dimensions.get('window');

const SingleGroup = () => {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedGroup, setEditedGroup] = useState(null);
  const [currentMember, setCurrentMember] = useState("");
  const [activeTab, setActiveTab] = useState('financial');
  const navigation = useNavigation();
  const [confetti, setConfetti] = useState(null);


  

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const member = JSON.parse(memberData);
          setCurrentMember(member);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
    fetchGroupDetails();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${saving_group_url}/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGroup(data);
        setEditedGroup(data);
        navigation.setOptions({ headerTitle: data.name });
      } else {
        setError('Failed to fetch group details');
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
      setError('An error occurred while fetching group details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${saving_group_url}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedGroup),
      });

      if (response.ok) {
        const updatedGroup = await response.json();
        setGroup(updatedGroup);
        setEditMode(false);
        Alert.alert('Success', 'Group details updated successfully');
        setConfetti(true);
        setTimeout(() => setConfetti(false), 5000);
      } else {
        throw new Error('Failed to update group details');
      }
    } catch (error) {
      console.error('Error updating group details:', error);
      Alert.alert('Error', 'Failed to update group details');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = () => {
    // Implement the logic to invite a new member
    Alert.alert(
      "Invite New Member",
      "This feature will allow you to invite a new member to the group.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => console.log("OK Pressed - Implement invitation logic here")
        }
      ]
    );
  };

  const handleCancel = () => {
    setEditedGroup(group);
    setEditMode(false);
  };

  const handleChange = (field, value) => {
    setEditedGroup(prev => ({ ...prev, [field]: value }));
  };

  const canEdit = currentMember.id === group?.created_by;

  const getMemberCount = (group) => {
    return group.members ? group.members.length : 0;
  };

  const renderHeader = useCallback(() => (
    <>
      <LinearGradient
        colors={['#8b5cf6', '#6b46c1']}
        className="rounded-xl shadow-md p-6 mb-6"
      >
        <Text className="text-3xl font-bold text-white mb-2 uppercase">{group.name}</Text>
        <Text className="text-gray-200 mb-2">Group Members: {getMemberCount(group)}</Text>
        <Text className="text-gray-200 mb-2">Created: {new Date(group.createdAt).toLocaleDateString()}</Text>
        <Text className="text-gray-200 mb-2">Saving Cycle: {group.start_date} to {group.end_date}</Text>
        <Text className="text-gray-200">Contribution Frequency: {group.contribution_frequency}</Text>
      </LinearGradient>

      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </>
  ), [group, activeTab]);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'financial':
        return (
          <FinancialCard editMode={editMode} editedGroup={editedGroup} handleChange={handleChange} />
        );
      case 'social':
        return (
          <View className="bg-white rounded-xl shadow-md p-6 mb-6">
            <Text className="text-xl font-semibold text-purple-800 mb-4">Social Fund</Text>
            <EditableInfoItem
              icon="cash-minus"
              label="Min Contribution"
              value={editedGroup.min_social_fund_contrib}
              isEditing={editMode}
              onChangeText={(value) => handleChange('min_social_fund_contrib', value)}
            />
            <EditableInfoItem
              icon="cash-plus"
              label="Max Contribution"
              value={editedGroup.max_social_fund_contrib}
              isEditing={editMode}
              onChangeText={(value) => handleChange('max_social_fund_contrib', value)}
            />
            <EditableInfoItem
              icon="clock-alert"
              label="Delay Time"
              value={editedGroup.social_fund_delay_time}
              isEditing={editMode}
              onChangeText={(value) => handleChange('social_fund_delay_time', value)}
            />
          </View>
        );
      case 'penalties':
        return (
          <View className="bg-white rounded-xl shadow-md p-6 mb-6">
            <Text className="text-xl font-semibold text-purple-800 mb-4">Penalties</Text>
            <EditableInfoItem
              icon="cash-remove"
              label="Saving Delay Fine"
              value={editedGroup.saving_delay_fine}
              isEditing={editMode}
              onChangeText={(value) => handleChange('saving_delay_fine', value)}
            />
          </View>
        );
      case 'members':
        return <View>
          <GroupInvitation groupId={group.id} />
          {/* <GroupMembersSection groupId={group.id} /> */}
        </View>;
      case 'durations':
        return <GroupPaymentDurationSection groupId={group.id} />;
      case 'requests':
        return <GroupJoinRequests groupId={group.id} group={group} />;
      default:
        return null;
    }
  }, [activeTab, editedGroup, editMode, group]);

  const renderFooter = useCallback(() => (
    canEdit && (
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
  ), [canEdit, editMode]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <ActivityIndicator size="large" color="#250048" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-50">
      {confetti && <Confetti ref={(node) => setConfetti(node)} />}
      
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => renderTabContent()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
};



export default SingleGroup;