import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

const getIconName = (item) => {
  switch (item.name) {
    case 'Saving Groups': return 'account-group';
    case 'Accounts': return 'cash';
    case 'Wallets': return 'wallet';
    case 'Meetings': return 'calendar-clock';
    case 'Saving Cycle': return 'refresh';
    case 'Contribution Frequency': return 'calendar-clock-outline';
    default: return 'help-circle';
  }
};

const ActivityItem = ({ item, onPress }) => (
  <TouchableOpacity
    className="w-[48%] bg-white rounded-xl shadow-md p-4 mb-4 items-center"
    onPress={onPress}
  >
    <Icon name={getIconName(item)} size={40} color="#028758" />
    <Text className="mt-2 font-semibold text-center">{item.name}</Text>
  </TouchableOpacity>
);

const ActivityDashboard = () => {
  const router = useRouter();

  const activities = [
    { name: 'Accounts', route: '/account' },
    { name: 'Saving Groups', route: '/saving-group' },
    { name: 'Wallets', route: '/group-wallet' },
    { name: 'Meetings', route: '/meeting-scheduler' },
    { name: 'Saving Cycle', route: '/saving-cycle' },
    { name: 'Contribution Frequency', route: '/contrib-freq' },
  ];

  return (
    <View className="flex-row flex-wrap justify-between">
      {activities.map((item, index) => (
        <ActivityItem 
          key={index} 
          item={item} 
          onPress={() => router.push(item.route)}
        />
      ))}
    </View>
  )
}

export default ActivityDashboard