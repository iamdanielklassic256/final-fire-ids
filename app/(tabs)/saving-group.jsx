import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SavingsWheel from '../../components/savings/SavingsWheel';
import GroupCard from '../../components/savings/GroupCard';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { member_saving_group_url } from '../../api/api';
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
  }, [member, groups]);

  const memberId = member.id
  // console.log('Member Id', memberId)

  const fetchAllSavingGroups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${member_saving_group_url}/${memberId}`);
      if (response.status === 200) {
        const data = await response.json();
        // if(data.length !== )
        // console.log('data ----', data)
        setGroups(data);
        setIsLoading(false);
      }
      setIsLoading(false);


    } catch (error) {
      setError('Failed to fetch cycles. Please try again later.');
      console.error('Error fetching cycles:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = () => {
    router.push('/add-group');
  };

  const handleGroupPress = (group) => {
    router.push(`/group/${group.id}`);
    console.log('Navigate to group details', group);
  };


  // console.log('saving group details', groups.length);

  return (
    <ScrollView style={styles.container}>
      <SavingsWheel groups={groups} onCreateGroup={handleCreateGroup} />
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