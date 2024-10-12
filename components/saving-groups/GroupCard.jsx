import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import InfoItem from './InfoItem';

const GroupCard = ({ group, onPress }) => {
  const getMemberCount = (group) => {
    return group.members ? group.members.length : 0;
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 350 }}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#250048', '#3f106c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.groupCard}
        >
          <View style={styles.cardContent}>
            <Text style={styles.groupName}>{group.name}</Text>
            <View className="flex flex-col items-start">
              <InfoItem 
                icon="cash-outline" 
                text={group.share_value ? `${group.group_curency} ${group.share_value}` : 'N/A'}
                subtext="Share Value"
              />
              <InfoItem 
                icon="time-outline" 
                text={`${group.start_date} : ${group.end_date}`}
                subtext="Saving Cycle"
              />
              <InfoItem 
                icon="calendar-outline" 
                text={group.contribution_frequency}
                subtext="Contribution"
              />
              <InfoItem 
                icon="people-outline" 
                text={getMemberCount(group).toString()}
                subtext="Members"
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
};



const styles = StyleSheet.create({
  groupCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 20,
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
 
  
});

export default GroupCard;