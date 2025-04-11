import { View, Text, ScrollView, Switch, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import SettingHeader from '../../components/settings/SettingHeader'

const SettingScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [donationReceipts, setDonationReceipts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [prayerNotifications, setPrayerNotifications] = useState(true);
  const [biblePlanReminders, setBiblePlanReminders] = useState(false);

  const SettingSection = ({ title, children }) => (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
      <View className="bg-white rounded-xl shadow-sm overflow-hidden">
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ icon, title, description, action }) => (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
      <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color="#4F46E5" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800">{title}</Text>
        {description && <Text className="text-sm text-gray-500">{description}</Text>}
      </View>
      {action}
    </View>
  );

  const SettingToggle = ({ value, onValueChange }) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#D1D5DB", true: "#C7D2FE" }}
      thumbColor={value ? "#4F46E5" : "#9CA3AF"}
    />
  );

  const SettingArrow = () => (
    <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <SettingHeader />
      
      <ScrollView className="flex-1 px-6">
        <SettingSection title="Account">
          <SettingItem
            icon="person-outline"
            title="Personal Information"
            description="Update your profile details"
            action={<SettingArrow />}
          />
          <SettingItem
            icon="key-outline"
            title="Change Password"
            description="Update your security credentials"
            action={<SettingArrow />}
          />
          <SettingItem
            icon="church-outline"
            title="Church Role"
            description="Member"
            action={<SettingArrow />}
          />
        </SettingSection>
        
        <SettingSection title="Notifications">
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            description="Receive important church updates"
            action={<SettingToggle value={notifications} onValueChange={setNotifications} />}
          />
          <SettingItem
            icon="calendar-outline"
            title="Event Reminders"
            description="Get notified about upcoming events"
            action={<SettingToggle value={eventReminders} onValueChange={setEventReminders} />}
          />
          <SettingItem
            icon="heart-outline"
            title="Prayer Requests"
            description="Notifications for new prayer requests"
            action={<SettingToggle value={prayerNotifications} onValueChange={setPrayerNotifications} />}
          />
          <SettingItem
            icon="book-outline"
            title="Bible Reading Plan"
            description="Daily reading reminders"
            action={<SettingToggle value={biblePlanReminders} onValueChange={setBiblePlanReminders} />}
          />
        </SettingSection>
        
        <SettingSection title="Giving & Donations">
          <SettingItem
            icon="cash-outline"
            title="Payment Methods"
            description="Manage your giving options"
            action={<SettingArrow />}
          />
          <SettingItem
            icon="receipt-outline"
            title="Donation History"
            description="View your giving transactions"
            action={<SettingArrow />}
          />
          <SettingItem
            icon="mail-outline"
            title="Donation Receipts"
            description="Receive receipts by email"
            action={<SettingToggle value={donationReceipts} onValueChange={setDonationReceipts} />}
          />
        </SettingSection>
        
        <SettingSection title="App Preferences">
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            description="Switch to dark theme"
            action={<SettingToggle value={darkMode} onValueChange={setDarkMode} />}
          />
          <SettingItem
            icon="globe-outline"
            title="Language"
            description="English"
            action={<SettingArrow />}
          />
          <SettingItem
            icon="text-outline"
            title="Text Size"
            description="Medium"
            action={<SettingArrow />}
          />
        </SettingSection>
        
        <SettingSection title="Support">
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            description="Find answers to common questions"
            action={<SettingArrow />}
          />
          <SettingItem
            icon="chatbubble-ellipses-outline"
            title="Contact Support"
            description="Get help with any issues"
            action={<SettingArrow />}
          />
          <SettingItem
            icon="information-circle-outline"
            title="About"
            description="App version 1.0.3"
            action={<SettingArrow />}
          />
        </SettingSection>
        
        <TouchableOpacity 
          className="mt-4 mb-8 bg-red-50 py-3 rounded-xl border border-red-100"
        >
          <Text className="text-red-600 font-medium text-center">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;