import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import SavingsWheel from '../../components/savings/SavingsWheel';
import GroupCard from '../../components/saving-groups/GroupCard';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { all_savings_groups_by_member_id } from '../../api/api';
import EnhancedLoader from '../../utils/EnhancedLoader';

export default function SavingGroup() {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [member, setMember] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Loading your savings groups...");

  // Array of engaging loading messages
  const loadingMessages = [
    "Calculating your savings progress...",
    "Gathering your group details...",
    "Preparing your financial overview...",
    "Loading your savings journey...",
    "Fetching your group activities...",
    "Updating your savings dashboard..."
  ];

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const memberId = JSON.parse(memberData);
          setMember(memberId);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        setError("Unable to load your profile. Please try again.");
      }
    };

    fetchMemberData();
  }, []);

  useEffect(() => {
    if (member && member.id) {
      fetchAllSavingGroups();
    }
  }, [member]);

  // Function to cycle through loading messages
  useEffect(() => {
    let messageInterval;
    if (isLoading) {
      messageInterval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2000); // Change message every 2 seconds
    }
    return () => clearInterval(messageInterval);
  }, [isLoading]);

  const fetchAllSavingGroups = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage(loadingMessages[0]);
      const response = await fetch(`${all_savings_groups_by_member_id}/${member.id}`);
      if (response.status === 200) {
        const data = await response.json();
        setGroups(data);
      } else {
        throw new Error('Failed to fetch groups');
      }
    } catch (error) {
      setError('Unable to fetch your savings groups. Please try again.');
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllSavingGroups().then(() => setRefreshing(false));
  }, [member]);

  const handleCreateGroup = () => {
    router.push('/add-group');
  };

  const handleAddNewMember = () => {
    router.push('/add-member');
  };

  const handleGroupPress = (group) => {
    router.push({
      pathname: `/group/${group.id}`,
      params: { groupId: group.id }
    });
  };

  const handleFetchGroupInvitation = () => {
    router.push('/group/invitation');
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SavingsWheel
          groups={groups}
          onCreateGroup={handleCreateGroup}
          onCreateMember={handleAddNewMember}
          onFetchGroupInvitation={handleFetchGroupInvitation}
        />
        <View style={styles.groupsContainer}>
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onPress={() => handleGroupPress(group)}
            />
          ))}
        </View>
      </ScrollView>
      <EnhancedLoader isLoading={isLoading} message={loadingMessage} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  groupsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 30,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});