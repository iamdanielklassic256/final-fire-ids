import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import InfoRow from './InfoRow';

const PersonalInformation = ({ member }) => {
  

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <InfoRow 
        label="Surname" 
        value={member?.first_name} 
        icon="user" 
      />
      <InfoRow 
        label="Given Name" 
        value={`${member?.last_name} ${member?.other_name || ''}`} 
        icon="user-plus" 
      />
      <InfoRow 
        label="Nationality" 
        value="UGANDAN" 
        icon="flag" 
      />
      <InfoRow 
        label="Gender" 
        value={member?.gender?.toUpperCase()} 
        icon="users" 
      />
      <InfoRow 
        label="Date of Birth" 
        value={member?.date_of_birth} 
        icon="calendar" 
      />
    </View>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a008f',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  infoRow: {
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
  textContainer: {
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