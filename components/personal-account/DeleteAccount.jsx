import { View, Text, Alert, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { delete_member_url } from '../../api/api';

const DeleteAccount = () => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [member, setMember] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const memberInfo = JSON.parse(memberData);
          setMember(memberInfo);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        Alert.alert("Error", "Unable to load your profile. Please try again.");
      }
    };

    fetchMemberData();
  }, []);

  const handleDeleteAccount = () => {
    setShowWarningModal(true);
  };

  const proceedWithDeletion = () => {
    setShowWarningModal(false);
    Alert.alert(
      "Final Confirmation",
      "Are you absolutely sure you want to delete your account? This cannot be undone.",
      [
        {
          text: "Keep Account",
          style: "cancel"
        },
        {
          text: "Yes, Delete Account",
          onPress: performDeletion,
          style: "destructive"
        }
      ]
    );
  };

  const performDeletion = async () => {
    if (!member || !member.id) {
      Alert.alert("Error", "Unable to process deletion. Please try again later.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${delete_member_url}/${member.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers like authorization if needed
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Clear local storage
      await AsyncStorage.clear();

      Alert.alert(
        "Account Deleted",
        "Your account has been successfully deleted. We're sorry to see you go.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to login screen
              router.replace("/sign-in");
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert(
        "Error",
        "There was a problem deleting your account. Please try again later."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View className="mt-5">
      <View className="bg-white rounded-xl p-4 mb-6">
        <TouchableOpacity
          onPress={handleDeleteAccount}
          disabled={isDeleting}
          className="flex-row items-center justify-between bg-red-50 rounded-lg p-4 border border-red-200"
        >
          <View className="flex-row items-center flex-1">
            <View className="bg-red-100 rounded-full p-2 mr-3">
              <Ionicons name="trash-outline" size={24} color="#ef4444" />
            </View>
            <View className="flex-1">
              <Text className="text-red-600 font-semibold text-base">
                Delete My Account
              </Text>
              <Text className="text-red-500 text-sm mt-1">
                This action cannot be reversed
              </Text>
            </View>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color="#ef4444" 
          />
        </TouchableOpacity>
      </View>

      {/* Warning Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWarningModal}
        onRequestClose={() => setShowWarningModal(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl w-full">
            {/* Modal Header */}
            <View className="p-6 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-semibold text-gray-800">
                  Before You Delete
                </Text>
                <TouchableOpacity
                  onPress={() => setShowWarningModal(false)}
                  className="p-2"
                >
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Modal Content */}
            <View className="p-6">
              {/* Warning Icon and Title */}
              <View className="flex-row items-center mb-6">
                <View className="bg-amber-100 rounded-full p-3">
                  <Ionicons name="warning-outline" size={28} color="#d97706" />
                </View>
                <Text className="text-amber-600 font-semibold text-lg ml-3">
                  Important Information
                </Text>
              </View>

              {/* Warning Items */}
              <View className="mb-6">
                <View className="flex-row items-center mb-4">
                  <Ionicons name="alert-circle" size={24} color="#dc2626" />
                  <Text className="text-red-600 font-medium text-base ml-2">
                    This action will:
                  </Text>
                </View>
                
                <View className="bg-red-50 rounded-xl p-4 mb-4">
                  <Text className="text-red-700 leading-6">
                    • Permanently delete your account{'\n'}
                    • Remove you from all savings groups{'\n'}
                    • Delete all your transaction history{'\n'}
                    • Cancel any pending transactions
                  </Text>
                </View>

                <View className="flex-row items-center mb-4">
                  <Ionicons name="checkmark-circle" size={24} color="#059669" />
                  <Text className="text-emerald-600 font-medium text-base ml-2">
                    Before proceeding, please ensure:
                  </Text>
                </View>

                <View className="bg-emerald-50 rounded-xl p-4">
                  <Text className="text-emerald-700 leading-6">
                    • All your pending transactions are completed{'\n'}
                    • You've downloaded any important transaction history{'\n'}
                    • You've informed your group members{'\n'}
                    • All outstanding loans or debts are cleared
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={() => setShowWarningModal(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-100 py-4 rounded-xl"
                >
                  <Text className="text-center text-gray-700 font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={proceedWithDeletion}
                  disabled={isDeleting}
                  className={`flex-1 ${isDeleting ? 'bg-red-400' : 'bg-red-600'} py-4 rounded-xl`}
                >
                  <Text className="text-center text-white font-semibold">
                    {isDeleting ? 'Deleting...' : 'Proceed with Deletion'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteAccount;