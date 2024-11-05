import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import InfoItem from './InfoItem';

const { width } = Dimensions.get('window');

const GroupCard = ({ group, onPress }) => {
  const getMemberCount = (group) => {
    return group.members ? group.members.length : 0;
  };

  // Calculate progress of saving cycle
  const calculateProgress = useMemo(() => {
    const startDate = new Date(group.start_date);
    const endDate = new Date(group.end_date);
    const currentDate = new Date();
    
    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;
    return Math.min(Math.max(elapsed / totalDuration, 0), 1) * 100;
  }, [group.start_date, group.end_date]);

  // Format currency with proper separators
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ 
        type: 'spring',
        damping: 15,
        duration: 400 
      }}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
        <LinearGradient
          colors={['#028758', '#4a008f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.groupCard}
        >
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <Ionicons name="trending-up" size={14} color="#fff" />
            <Text style={styles.statusText}>Active</Text>
          </View>

          <View style={styles.cardContent}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.groupName}>{group.name}</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${calculateProgress}%` }]} />
                <Text style={styles.progressText}>{`${Math.round(calculateProgress)}% Complete`}</Text>
              </View>
            </View>

            {/* Main Info Grid */}
            <View style={styles.infoGrid}>
              <InfoItem 
                icon="wallet-outline" 
                text={group.share_value ? 
                  `${group.group_curency} ${formatCurrency(group.share_value)}` : 
                  'N/A'}
                subtext="Share Value"
                iconColor="#6ee7b7"
              />
              <InfoItem 
                icon="calendar-outline" 
                text={group.contribution_frequency}
                subtext="Contribution Cycle"
                iconColor="#93c5fd"
              />
              <InfoItem 
                icon="people-outline" 
                text={`${getMemberCount(group)} Members`}
                subtext="Group Size"
                iconColor="#fde047"
              />
              <InfoItem 
                icon="time-outline" 
                text={`${group.start_date.split('-')[1]}/${group.start_date.split('-')[0]} - ${group.end_date.split('-')[1]}/${group.end_date.split('-')[0]}`}
                subtext="Duration"
                iconColor="#f9a8d4"
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
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#4a008f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  groupName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6ee7b7',
    borderRadius: 3,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
    opacity: 0.9,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  nextPaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  nextPaymentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default GroupCard;