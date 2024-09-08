import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import SavingsWheel from '../../components/savings/SavingsWheel';
import GroupCard from '../../components/savings/GroupCard';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { all_savings_groups_by_member_id } from '../../api/api';
import Loader from '../../components/Loader'

export default function SavingGroup() {
  const [isLoading, setIsLoading] = useState(false)
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [member, setMember] = useState("");

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
      }
    };

    fetchMemberData();
  }, []);

  useEffect(() => {
    if (member && member.id) {
      fetchAllSavingGroups();
    }
  }, [member]);

  const fetchAllSavingGroups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${all_savings_groups_by_member_id}/${member.id}`);
      if (response.status === 200) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      setError('Failed to fetch cycles. Please try again later.');
      console.error('Error fetching cycles:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <ScrollView style={styles.container}>
      <SavingsWheel
        groups={groups}
        onCreateGroup={handleCreateGroup}
        onCreateMember={handleAddNewMember}
      />
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <View style={styles.groupsContainer}>
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onPress={() => handleGroupPress(group)}
            />
          ))}
        </View>
      )}
    </ScrollView>
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
  },
});