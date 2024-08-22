import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SavingsWheel from '../../components/savings/SavingsWheel';
import GroupCard from '../../components/savings/GroupCard';
import { router } from 'expo-router';

export default function SavingGroup() {
  const [groups, setGroups] = useState([
    { 
      id: 1, 
      name: 'Dream Vacation Fund', 
      share_value: 100000, 
      group_currency: 'UGX',
      cycle: 'Monthly',
      frequency: 'Every 1st'
    },
    { 
      id: 2, 
      name: 'Tech Gadgets Savings', 
      share_value: 50000, 
      group_currency: 'UGX',
      cycle: 'Weekly',
      frequency: 'Every Friday'
    },
    { 
      id: 3, 
      name: 'Emergency Fund', 
      share_value: 2000000, 
      group_currency: 'UGX',
      cycle: 'Bi-weekly',
      frequency: 'Every 2nd and 4th Monday'
    },
    { 
      id: 4, 
      name: 'Home Down Payment',
      cycle: 'Monthly',
      frequency: 'Every 15th'
    },
  ]);

  const handleCreateGroup = () => {
    router.push('/add-group');
  };

  const handleGroupPress = (group) => {
    console.log('Navigate to group details', group);
  };

  return (
    <ScrollView style={styles.container}>
      <SavingsWheel groups={groups} onCreateGroup={handleCreateGroup} />
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