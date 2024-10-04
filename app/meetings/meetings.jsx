import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { all_savings_groups_by_member_id } from '../../api/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MeetingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [member, setMember] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMemberData();
  }, []);

  useEffect(() => {
    if (member && member.id) {
      fetchAllSavingGroups();
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

  const fetchAllSavingGroups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${all_savings_groups_by_member_id}/${member.id}`);
      if (response.status === 200) {
        const data = await response.json();
        setGroups(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch groups');
      }
    } catch (error) {
      setError('Failed to fetch groups. Please try again later.');
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllSavingGroups();
  };

  const getGroupStatusColor = (status) => {
    if (!status) return '#9E9E9E'; // Default color for undefined status
    switch (status.toLowerCase()) {
      case 'active': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'completed': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const navigateToGroupDetails = (group) => {
    router.push({
      pathname: '/meetings/[id]',
      params: { id: group.id, groupName: group.name }
    });
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.groupCard, { borderLeftColor: getGroupStatusColor(item.status) }]}
      onPress={() => navigateToGroupDetails(item)}
    >
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getGroupStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.groupDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="calendar-clock" size={18} color="#616161" />
          <Text style={styles.detailText}>{item.meeting_frequency}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && groups.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading your groups...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#f44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAllSavingGroups}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Saving Groups</Text>
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>You're not part of any saving groups yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    borderLeftWidth: 6,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  groupDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    color: '#616161',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#757575',
    marginTop: 32,
  },
});

export default MeetingScreen;