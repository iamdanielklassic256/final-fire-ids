import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logout from '../../components/app/Logout';
import SettingOption from '../../components/app/SettingOption';
import { settingsData } from '../../data/data';
import DeleteAccount from '../../components/personal-account/DeleteAccount';


const Profile = () => {

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView>
        <View className="bg-[#028758] h-32 rounded-b-[40px]">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity
              className="bg-white/20 p-2 rounded-full"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Settings</Text>
          </View>
        </View>
        <View className="mx-4 mb-6 mt-6">
          {settingsData.map((setting, index) => (
            <SettingOption
              key={index}
              title={setting.title}
              icon={setting.icon}
              subtitle={setting.subtitle}
              onPress={() => {
                router.push(setting.route);
                console.log(`pushed ${setting.route}`);
              }}
            />
          ))}
        </View>
        <View className="flex flex-row items-center justify-center flex-1 mx-4 mb-8 bg-red-500 rounded-xl p-2">
          <Logout />
        </View>
        <DeleteAccount />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;