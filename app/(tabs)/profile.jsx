import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Profile = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="bg-blue-600 h-24 rounded-b-3xl">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Profile Settings</Text>
            
          </View>
        </View>
        
        <View className="mt-6 mx-4">
          
          <TouchableOpacity 
          className="bg-white rounded-xl p-4 mb-3 flex-row justify-between items-center"  
          onPress={() => {
            router.push('/contact')
            console.log('pushed contact');
          }}
          >
            <View>
              <Text className="text-lg font-semibold">Update Contact Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-semibold">Change PIN</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-semibold">Verification Status</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-semibold">Personal Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-semibold">National ID Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;