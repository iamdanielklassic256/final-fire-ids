import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Shield,
  MapPin,
  Star,
  ChevronRight,
  Building2
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

export default function EmergencyScreen() {
  const { theme, isDarkMode } = useTheme();
  const [showingConfirmation, setShowingConfirmation] = useState(false);

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'Are you in an emergency situation that requires immediate assistance?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call 911',
          style: 'destructive',
          onPress: () => {
            Linking.openURL('tel:911');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCall = (number, name) => {
    Alert.alert(
      `Call ${name}`,
      `Would you like to call ${name} at ${number}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleText = (number) => {
    Linking.openURL(`sms:${number}`);
  };

  const emergencyContacts = [
    {
      name: 'Firefighter Team 1',
      number: '0704242384',
      description: 'Local firefighting response unit',
      icon: <Shield size={22} color={theme.primary} />,
      priority: 'high'
    },
    {
      name: 'Firefighter Team 2',
      number: '07795015',
      description: 'Secondary firefighting response unit',
      icon: <Shield size={22} color={theme.primary} />,
      priority: 'high'
    },
    {
      name: 'Firefighter Team 3',
      number: '0760849047',
      description: 'Emergency firefighting support',
      icon: <Shield size={22} color={theme.primary} />,
      priority: 'high'
    },
    {
      name: 'Forest Owner',
      number: '555-FOR-OWNER',
      description: 'Contact for forest property concerns',
      icon: <MapPin size={22} color={theme.primary} />,
      priority: 'normal'
    },
    {
      name: 'Forest Authorities',
      number: '555-FOR-AUTH',
      description: 'Official forest management and regulations',
      icon: <Building2 size={22} color={theme.primary} />,
      priority: 'normal'
    }
  ];

  // For iOS, we can add a contact to the address book
  const addToContacts = (contact) => {
    // This would normally use the Contacts API, but for simplicity
    Alert.alert(
      'Add to Contacts',
      `Would you like to add ${contact.name} to your contacts?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add',
          onPress: () => {
            Alert.alert('Contact Added', `${contact.name} has been added to your contacts.`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          className="w-10 h-10 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Emergency Contacts</Text>
        <View className="w-10" />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.background }} className="rounded-t-xl">
        <ScrollView className="flex-1">
          {/* Contacts List */}
          <View className="px-4 pt-4">
            <Text style={{ color: theme.text }} className="font-bold text-xl mb-3">Important Contacts</Text>

            {emergencyContacts.map((contact, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(300 + (index * 50)).duration(500)}
                className="mb-3"
              >
                <View
                  style={{ 
                    backgroundColor: contact.priority === 'high' ? theme.primaryLight : theme.surface,
                    borderColor: contact.priority === 'high' ? theme.primary : theme.border
                  }}
                  className="p-4 rounded-xl border"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View
                        style={{ backgroundColor: theme.primaryLight }}
                        className="w-10 h-10 rounded-full items-center justify-center"
                      >
                        {contact.icon}
                      </View>
                      <View className="ml-3 flex-1">
                        <View className="flex-row items-center">
                          <Text style={{ color: theme.text }} className="font-bold">{contact.name}</Text>
                          {contact.priority === 'emergency' && (
                            <View className="ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primaryLight }}>
                              <Text style={{ color: theme.primary }} className="text-xs font-medium">Emergency</Text>
                            </View>
                          )}
                        </View>
                        <Text style={{ color: theme.textSecondary }} className="text-sm">{contact.description}</Text>
                      </View>
                    </View>

                    {contact.priority === 'emergency' ? (
                      <TouchableOpacity
                        style={{ backgroundColor: theme.primary }}
                        className="py-2 px-4 rounded-lg"
                        onPress={() => handleEmergencyCall()}
                      >
                        <Text className="text-white font-bold">Call</Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="flex-row">
                        <TouchableOpacity
                          style={{ backgroundColor: theme.primary }}
                          className="w-10 h-10 rounded-lg items-center justify-center mr-2"
                          onPress={() => handleCall(contact.number, contact.name)}
                        >
                          <Phone size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{ backgroundColor: theme.secondary }}
                          className="w-10 h-10 rounded-lg items-center justify-center"
                          onPress={() => handleText(contact.number)}
                        >
                          <MessageSquare size={20} color="white" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {/* Show number for non-emergency contacts */}
                  {contact.priority !== 'emergency' && (
                    <View className="mt-2">
                      <Text style={{ color: theme.text }}>{contact.number}</Text>
                    </View>
                  )}

                  {/* Save contact option for normal priority contacts */}
                  {contact.priority === 'normal' && (
                    <TouchableOpacity
                      className="mt-2 flex-row items-center"
                      onPress={() => addToContacts(contact)}
                    >
                      <Star size={14} color={theme.textSecondary} />
                      <Text style={{ color: theme.textSecondary }} className="text-sm ml-1">Save to contacts</Text>
                      <ChevronRight size={14} color={theme.textSecondary} className="ml-1" />
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Info on bottom */}
          <Animated.View
            entering={FadeInDown.delay(800).duration(500)}
            className="mx-4 my-4"
          >
            <View style={{ backgroundColor: theme.infoBackground }} className="p-4 rounded-xl">
              <Text style={{ color: theme.infoText }} className="font-medium mb-2">Be Prepared</Text>
              <Text style={{ color: theme.infoText }}>
                Save these important contacts to your phone now, before an emergency occurs. Being prepared can save precious time during critical situations.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}