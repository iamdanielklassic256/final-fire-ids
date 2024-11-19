import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { saving_group_url } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Confetti from 'react-native-confetti';
import { Feather } from '@expo/vector-icons';
import AkibaHeader from '../../components/AkibaHeader'
import GroupTab from '../../components/group-dashboard/GroupTab';
import MainGroupDashboard from '../../components/group-dashboard/MainGroupDashboard';
import GroupMeetingSection from '../../components/group-dashboard/meetings/GroupMeetingSection';
import GroupProfile from '../../components/group-dashboard/profile/GroupProfile';

const SingleGroup = () => {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMember, setCurrentMember] = useState("");
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGroupDetails();
    setRefreshing(false);
  }, [id]);

  const renderHeader = () => (
    <View className="">
      <AkibaHeader
        message="Welcome to"
        title={`${group?.name} Saving Group`}
      />
    </View>
  );

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <MainGroupDashboard group={group} />

        );
      case 'meetings':
        return (
          <GroupMeetingSection />
        );
      case 'group-profile':
        return (
          <GroupProfile group={group} />
        );
      default:
        return null;
    }
  }, [activeTab, group]);

  const renderTabBar = () => (
    <GroupTab
      setActiveTab={setActiveTab}
      activeTab={activeTab}
    />
  );

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
    <View className="flex-1 bg-gray-100">
      {confetti && <Confetti ref={(node) => setConfetti(node)} />}

      <FlatList
        data={[{ key: 'content' }]}
        ListHeaderComponent={() => (
          <>
            {renderHeader()}
            {renderTabBar()}
          </>
        )}
        renderItem={() => renderTabContent()}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#111827"]}
            tintColor="#111827"
          />
        }
      />
    </View>
  );
};

export default SingleGroup;