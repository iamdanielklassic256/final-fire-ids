// InvitationsList.js
import React from 'react';
import { FlatList, View, Text } from 'react-native';

const InvitationsList = ({ invitations }) => {
  const formatInvitedMemberName = (member) => {
    const names = [member?.first_name, member?.last_name, member?.other_name].filter(Boolean);
    return names.join(' ');
  };

  const pendingInvitations = invitations.filter(invitation => invitation.status === 'pending');

  return (
    <FlatList
      data={pendingInvitations}
      renderItem={({ item }) => {
        const invitedMember = item.invitedMember;
        const formattedName = formatInvitedMemberName(invitedMember);

        return (
          <View className="flex flex-row justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-medium">{formattedName}</Text>
            <Text className="text-sm text-yellow-500">{item.status}</Text>
          </View>
        );
      }}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      ListEmptyComponent={() => (
        <Text className="text-center p-4 text-gray-500">
          No pending invitations found
        </Text>
      )}
    />
  );
};

export default InvitationsList;