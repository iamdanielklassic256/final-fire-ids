import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Alert, Dimensions, RefreshControl } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { saving_group_url } from '../../api/api';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Confetti from 'react-native-confetti';
import GroupPaymentDurationSection from '../../components/savings/GroupPaymentDurationSection';
import GroupInvitation from '../../components/saving-groups/GroupInvitation';
import GroupJoinRequests from '../../components/savings/GroupJoinRequests';
import TabBar from '../../components/saving-groups/TabBar';
import EditableInfoItem from '../../components/saving-groups/EditableInfoItem';
import FinancialCard from '../../components/saving-groups/FinancialCard';
import GroupHeader from '../../components/saving-groups/GroupHeader';
import SocialCard from '../../components/saving-groups/SocialCard';
import PenaltyCard from '../../components/saving-groups/PenaltyCard';
import GroupFooter from '../../components/saving-groups/GroupFooter';


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
  const [refreshing, setRefreshing] = useState(false);




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



  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGroupDetails();
    await fetchMemberData();
    setRefreshing(false);
  }, [id]);

  const renderHeader = useCallback(() => (
    <GroupHeader
      group={group}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  ), [group, activeTab]);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'financial':
        return (
          <FinancialCard editMode={editMode} editedGroup={editedGroup} handleChange={handleChange} />
        );
      case 'social':
        return (
          <SocialCard editMode={editMode} editedGroup={editedGroup} handleChange={handleChange} />
        );
      case 'penalties':
        return (
          <PenaltyCard editMode={editMode} editedGroup={editedGroup} handleChange={handleChange} />
        );
      case 'members':
        return <View>
          <GroupInvitation groupId={group.id} canEdit={canEdit}/>
        </View>;
      case 'durations':
        return <GroupPaymentDurationSection groupId={group.id} />;
      case 'requests':
        return <GroupJoinRequests groupId={group.id} group={group} />;
      default:
        return null;
    }
  }, [activeTab, editedGroup, editMode, group]);

  const renderFooter = useCallback(() => {
    const editableTabs = ['financial', 'social', 'penalties'];
    if (canEdit && editableTabs.includes(activeTab)) {
      return (
        <GroupFooter
          editMode={editMode}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      );
    }
    return null;
  }, [canEdit, editMode, activeTab]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <ActivityIndicator size="large" color="#250048" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <TouchableOpacity onPress={onRefresh} className="bg-purple-500 px-4 py-2 rounded-md">
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#250048"]}
            tintColor="#250048"
          />
        }
      />
    </View>
  );
};



export default SingleGroup;