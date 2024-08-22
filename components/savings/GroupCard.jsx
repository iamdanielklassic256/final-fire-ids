import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const GroupCard = ({ group, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.groupCard}
      >
        <Text style={styles.groupName}>{group.name}</Text>
        <View style={styles.groupInfo}>
          <Ionicons name="cash-outline" size={16} color="#FFF" />
          <Text style={styles.groupInfoText}>
            {group.share_value ? `${group.group_currency} ${group.share_value}` : 'N/A'}
          </Text>
        </View>
        <View style={styles.groupInfo}>
          <Ionicons name="time-outline" size={16} color="#FFF" />
          <Text style={styles.groupInfoText}>{group.cycle}</Text>
        </View>
        <View style={styles.groupInfo}>
          <Ionicons name="calendar-outline" size={16} color="#FFF" />
          <Text style={styles.groupInfoText}>{group.frequency}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  groupCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  groupInfoText: {
    marginLeft: 8,
    color: '#FFF',
  },
});

export default GroupCard;