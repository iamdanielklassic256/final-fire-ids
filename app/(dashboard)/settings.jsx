import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import logo from '../../assets/logo/logo.png';
import { ChevronRight, MailCheck, PhoneCall } from 'lucide-react-native';

const AboutScreen = () => {
  // Function to handle contact links
  const handleContact = (type, value) => {
    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="items-center pt-10 pb-6 bg-white">
          <Image 
            source={logo} 
            className="h-24 w-24 rounded-xl shadow-md mb-4" 
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-gray-800">Church Bible Connect</Text>
          <Text className="text-sm text-gray-500 mt-1">Version 1.0.0</Text>
        </View>
        
        {/* Description Card */}
        <View className="mx-5 mt-6 bg-white rounded-xl shadow-sm p-5">
          <Text className="text-gray-700 text-base leading-6 text-center">
            Church Bible Connect is a mobile application designed to help believers grow in their faith
            by providing easy access to the Word of God, Bible tools, and spiritual resources.
          </Text>
        </View>
        
        {/* Developer Info */}
        <View className="mx-5 mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <View className="px-5 py-4 border-b border-gray-100">
            <Text className="text-gray-500 font-medium text-sm">DEVELOPER</Text>
          </View>
          
          <View className="px-5 py-4">
            <Text className="text-gray-800 font-medium text-lg">Okumu Daniel Comboni</Text>
            <Text className="text-gray-600 text-sm">CEO and Founder of Pro Church Manager</Text>
          </View>
        </View>
        
        {/* Contact Info */}
        <View className="mx-5 mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <View className="px-5 py-4 border-b border-gray-100">
            <Text className="text-gray-500 font-medium text-sm">CONTACT</Text>
          </View>
          
          <TouchableOpacity 
            className="flex-row items-center px-5 py-4 border-b border-gray-100"
            onPress={() => handleContact('phone', '+256772837541')}
          >
            <PhoneCall width={20} height={20} stroke="#4b5563" className="mr-3" />
            <View className="flex-1">
              <Text className="text-gray-800">+256 772 837 541</Text>
            </View>
            <ChevronRight width={20} height={20} stroke="#9ca3af" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center px-5 py-4"
            onPress={() => handleContact('email', 'okumucomboni@gmail.com')}
          >
            <MailCheck width={20} height={20} stroke="#4b5563" className="mr-3" />
            <View className="flex-1">
              <Text className="text-gray-800">okumucomboni@gmail.com</Text>
            </View>
            <ChevronRight width={20} height={20} stroke="#9ca3af" />
          </TouchableOpacity>
        </View>
        
        {/* Social Media */}
        
        
        {/* Footer */}
        <View className="py-8 items-center">
          <Text className="text-gray-400 text-xs">© 2025 Church Bible Connect. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;