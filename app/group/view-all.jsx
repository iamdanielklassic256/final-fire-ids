import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  Alert, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// API and Utility Imports
import { all_savings_groups_by_member_id } from '../../api/api';
import EnhancedLoader from '../../utils/EnhancedLoader';
import AkibaHeader from '../../components/AkibaHeader';
import GroupItem from '../../components/personal-account/GroupItem';
import ErrorState from '../../components/ErrorState';

const ViewAllGroups = () => {
  // State Management
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [member, setMember] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Loading your savings groups...");

  // Dynamic Loading Messages
  const loadingMessages = [
    "Calculating your savings progress...",
    "Gathering your group details...",
    "Preparing your financial overview...",
    "Loading your savings journey...",
    "Fetching your group activities...",
    "Updating your savings dashboard..."
  ];

  // Fetch Member Data
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem('member');
        if (memberData) {
          const memberInfo = JSON.parse(memberData);
          setMember(memberInfo);
        } else {
          throw new Error('No member data found.');
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
        Alert.alert(
          'Profile Error', 
          'Unable to load your profile. Please log in again.', 
          [{ 
            text: 'OK', 
            onPress: () => router.replace('/login') 
          }]
        );
      }
    };

    fetchMemberData();
  }, []);

  // Fetch Savings Groups when Member is Available
  useEffect(() => {
    if (member && member.id) {
      fetchAllSavingGroups();
    }
  }, [member]);

  // Cycling Loading Messages
  useEffect(() => {
    let messageInterval;
    if (isLoading) {
      messageInterval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2000);
    }
    return () => clearInterval(messageInterval);
  }, [isLoading]);

  // Fetch Savings Groups
  const fetchAllSavingGroups = async () => {
    if (!member || !member.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${all_savings_groups_by_member_id}/${member.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Unable to fetch your savings groups. Please check your connection.');
      Alert.alert('Network Error', 'Could not load savings groups. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pull to Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllSavingGroups().then(() => setRefreshing(false));
  }, [member]);

  // Navigate Back
  const handleGoBack = () => router.back();



  const getMemberCount = (group) => {
    return group.members ? group.members.length : 0;
  };



  // Render Individual Group Item
  const renderGroupItem = ({ item }) => (
    <GroupItem 
    getMemberCount={getMemberCount}
    item={item}
    router={router}
    />
  );

  // Empty State Component
  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Feather name="folder-plus" size={64} color="#CBD5E0" />
      <Text style={styles.emptyStateTitle}>No Savings Groups Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Create your first savings group and start your financial journey
      </Text>
      <TouchableOpacity 
        style={styles.createGroupButton}
        onPress={() => router.push('/create-group')}
      >
        <Text style={styles.createGroupButtonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );

  // Main Render
  if (isLoading && !groups.length) {
    return <EnhancedLoader isLoading={true} message={loadingMessage} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <AkibaHeader
        title="Saving Groups"
        message="View all your saving groups"
        color="white"
        handlePress={handleGoBack}
        icon="arrow-back"
      />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGroupItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={error ? (
          <ErrorState
            error={error}
            fetchAllSavingGroups={fetchAllSavingGroups}
          />
        ) : <EmptyState />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={error ? (
          <ErrorState
            error={error}
            fetchAllSavingGroups={fetchAllSavingGroups}
          />
        ) : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#718096',
  },
  listContainer: {
    padding: 16,
  },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupDetails: {
    flex: 1,
    marginRight: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#2D3748',
  },
  groupDescription: {
    color: '#4A5568',
    marginBottom: 8,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    color: '#4A5568',
    fontSize: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    color: 'white',
  },
  emptyStateSubtitle: {
    textAlign: 'center',
    color: '#CBD5E0',
    marginTop: 8,
  },
  createGroupButton: {
    backgroundColor: '#4299E1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  createGroupButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  errorStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    color: '#E53E3E',
  },
  errorStateSubtitle: {
    textAlign: 'center',
    color: '#4A5568',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#4299E1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '700',
  },
});

export default ViewAllGroups;