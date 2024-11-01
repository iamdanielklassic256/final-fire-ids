import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const MemberDetails = () => {
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const parsedMember = JSON.parse(memberData);
          setMember(parsedMember);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not verified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={20} color="#4a008f" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'Not provided'}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a008f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileInitials}>
              {member?.first_name?.[0]}{member?.last_name?.[0]}
            </Text>
          </View>
          <Text style={styles.name}>
            {`${member?.first_name || ''} ${member?.other_name || ''} ${member?.last_name || ''}`}
          </Text>
          <View style={styles.verificationBadge}>
            <Feather name={member?.contact_verified ? "check-circle" : "alert-circle"} size={16} color="#028758" />
            <Text style={styles.verificationText}>
              {member?.contact_verified ? "Verified Member" : "Unverified Member"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <InfoItem icon="user" label="National ID" value={member?.national_identification_number} />
          <InfoItem icon="calendar" label="Date of Birth" value={member?.date_of_birth} />
          <InfoItem icon="user" label="Gender" value={member?.gender} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <InfoItem icon="phone" label="Primary Contact" value={member?.contact_one} />
          <InfoItem icon="phone" label="Secondary Contact" value={member?.contact_two} />
          <InfoItem icon="mail" label="Email" value={member?.email} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          <InfoItem 
            icon="clock" 
            label="Contact Verified At" 
            value={formatDate(member?.contact_one_verified_at)} 
          />
          <InfoItem 
            icon="check-circle" 
            label="Email Verified At" 
            value={formatDate(member?.email_verified_at)} 
          />
          <InfoItem 
            icon="check-square" 
            label="NIN Verified At" 
            value={formatDate(member?.nin_verified_at)} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4a008f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitials: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verificationText: {
    marginLeft: 5,
    color: '#028758',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a008f',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default MemberDetails;