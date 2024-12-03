import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GroupDashboardCard from '../components/group-dashboard/GroupDashboardCard';
import AkibaHeader from '../components/AkibaHeader';

const GroupDashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupData = await AsyncStorage.getItem("group_information");
        if (groupData) {
          const parsedGroups = JSON.parse(groupData);
          setGroups(parsedGroups.data ? [parsedGroups.data.group] : []);
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    fetchGroupData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem("group_information");
      router.push("/group-login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderHeader = () => (
    <AkibaHeader
      message="Welcome to Akiba!"
      title="My Saving Groups"
      handleLogOut={handleLogOut}
      icon="log-out"
      color="white"
    />
  );

  const renderGroupCard = (group) => (
    <GroupDashboardCard group={group} key={group.id} />
  );

  const renderGroups = () => (
    <View className="px-1 py-4">
      {groups.length > 0 ? (
        groups.map(renderGroupCard)
      ) : (
        <Text className="text-white/70 text-center py-4">
          No groups found. Create a new group to get started.
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#ffffff']}
        className="flex-1"
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="white"
            />
          }
        >
          {renderHeader()}
          {renderGroups()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default GroupDashboardScreen;