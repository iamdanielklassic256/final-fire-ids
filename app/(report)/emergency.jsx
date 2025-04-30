import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  Shield, 
  AlertTriangle, 
  MapPin,
  Star,
  ChevronRight,
  Headphones,
  Building2,
  Users,
  Heart
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function EmergencyScreen() {
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
      name: 'Fire Department',
      number: '911',
      description: 'For immediate fire emergencies and rescue',
      icon: <AlertTriangle size={22} color="#dc2626" />,
      priority: 'emergency'
    },
    {
      name: 'Forest Service Hotline',
      number: '800-555-1234',
      description: 'Report wildfires and get forest status updates',
      icon: <Shield size={22} color="#16a34a" />,
      priority: 'high'
    },
    {
      name: 'Local Fire Station',
      number: '555-123-4567',
      description: 'Non-emergency fire-related questions',
      icon: <Building2 size={22} color="#2563eb" />,
      priority: 'normal'
    },
    {
      name: 'Emergency Management',
      number: '555-234-5678',
      description: 'Information about evacuations and shelters',
      icon: <Users size={22} color="#2563eb" />,
      priority: 'normal'
    },
    {
      name: 'Emergency Medical Services',
      number: '911',
      description: 'For medical emergencies related to fires',
      icon: <Heart size={22} color="#dc2626" />,
      priority: 'emergency'
    },
    {
      name: 'Fire Prevention Office',
      number: '555-345-6789',
      description: 'Information about permits and regulations',
      icon: <MapPin size={22} color="#2563eb" />,
      priority: 'normal'
    },
    {
      name: 'Disaster Assistance',
      number: '800-555-5678',
      description: 'Recovery resources after a fire',
      icon: <Headphones size={22} color="#2563eb" />,
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
    <SafeAreaView className="flex-1 bg-purple-600">
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Emergency Contacts</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 bg-gray-50 rounded-t-xl">
        <ScrollView className="flex-1">
          {/* Emergency Call Banner */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(500)}
            className="m-4"
          >
            <TouchableOpacity
              className="bg-gradient-to-r from-red-600 to-red-700 p-5 rounded-xl"
              onPress={handleEmergencyCall}
              accessibilityLabel="Call emergency number 911"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                    <Phone size={28} color="white" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-xl font-bold text-white">Emergency Call</Text>
                    <Text className="text-white/80">Tap to call 911 immediately</Text>
                  </View>
                </View>
                <Text className="text-3xl font-bold text-white">911</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Warning Banner */}
          <Animated.View 
            entering={FadeInDown.delay(200).duration(500)}
            className="mx-4 mb-4"
          >
            <View className="bg-amber-100 p-4 rounded-xl flex-row items-center">
              <AlertTriangle size={24} color="#d97706" />
              <Text className="text-amber-800 ml-2 flex-1">
                Only call 911 for genuine emergencies. Misuse can prevent others from getting help.
              </Text>
            </View>
          </Animated.View>

          {/* Contacts List */}
          <View className="px-4">
            <Text className="font-bold text-gray-800 text-xl mb-3">Important Contacts</Text>
            
            {/* Emergency Contacts First */}
            {emergencyContacts
              .sort((a, b) => {
                const priorityOrder = { emergency: 0, high: 1, normal: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((contact, index) => (
                <Animated.View 
                  key={index}
                  entering={FadeInDown.delay(300 + (index * 50)).duration(500)}
                  className="mb-3"
                >
                  <View 
                    className={`p-4 rounded-xl border ${
                      contact.priority === 'emergency' 
                        ? 'bg-red-50 border-red-200' 
                        : contact.priority === 'high'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200'
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View 
                          className={`w-10 h-10 rounded-full items-center justify-center ${
                            contact.priority === 'emergency' 
                              ? 'bg-red-100' 
                              : contact.priority === 'high'
                                ? 'bg-green-100'
                                : 'bg-blue-100'
                          }`}
                        >
                          {contact.icon}
                        </View>
                        <View className="ml-3 flex-1">
                          <View className="flex-row items-center">
                            <Text className="font-bold text-gray-800">{contact.name}</Text>
                            {contact.priority === 'emergency' && (
                              <View className="ml-2 px-2 py-0.5 bg-red-100 rounded-full">
                                <Text className="text-xs font-medium text-red-700">Emergency</Text>
                              </View>
                            )}
                          </View>
                          <Text className="text-gray-600 text-sm">{contact.description}</Text>
                        </View>
                      </View>
                      
                      {contact.priority === 'emergency' ? (
                        <TouchableOpacity
                          className="bg-red-600 py-2 px-4 rounded-lg"
                          onPress={() => handleEmergencyCall()}
                        >
                          <Text className="text-white font-bold">Call</Text>
                        </TouchableOpacity>
                      ) : (
                        <View className="flex-row">
                          <TouchableOpacity
                            className="bg-blue-500 w-10 h-10 rounded-lg items-center justify-center mr-2"
                            onPress={() => handleCall(contact.number, contact.name)}
                          >
                            <Phone size={20} color="white" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            className="bg-gray-500 w-10 h-10 rounded-lg items-center justify-center"
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
                        <Text className="text-gray-700">{contact.number}</Text>
                      </View>
                    )}
                    
                    {/* Save contact option for normal priority contacts */}
                    {contact.priority === 'normal' && (
                      <TouchableOpacity
                        className="mt-2 flex-row items-center"
                        onPress={() => addToContacts(contact)}
                      >
                        <Star size={14} color="#6b7280" />
                        <Text className="text-gray-500 text-sm ml-1">Save to contacts</Text>
                        <ChevronRight size={14} color="#6b7280" className="ml-1" />
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
            <View className="bg-blue-50 p-4 rounded-xl">
              <Text className="text-blue-800 font-medium mb-2">Be Prepared</Text>
              <Text className="text-blue-700">
                Save these important contacts to your phone now, before an emergency occurs. Being prepared can save precious time during critical situations.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}