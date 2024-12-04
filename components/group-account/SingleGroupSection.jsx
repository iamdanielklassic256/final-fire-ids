import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Users, BookOpen, Award, Wallet } from 'lucide-react-native'
import { useRouter } from 'expo-router'

const SingleGroupSection = ({ groupId }) => {
  const router = useRouter();

  const sections = [
    {
      id: 'groupWallets',
      label: 'Group Wallet',
      icon: Wallet,
      route: `group-wallet/${groupId}`,
    },
    {
      id: 'memberProfile',
      label: 'Member Profile',
      icon: Users,
      route: `group-member/${groupId}`,
    },
    {
      id: 'electOfficers',
      label: 'Elect Officers',
      icon: Award,
      route: `group-officers/${groupId}`,
    },
    {
      id: 'groupInvitation',
      label: 'Group Invitation',
      icon: Award,
      route: `group-invitation/${groupId}`,
    },

  ];

  return (
    <View className="mx-4 mt-4">
      <View>
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <TouchableOpacity
              key={section.id}
              className="flex-row items-center p-4 rounded-xl mb-4 bg-blue-50 border border-[#028758] shadow-sm"
              onPress={() => router.push(section.route)}
            >
              <View className="mr-4">
                <Icon color="#028758" size={24} />
              </View>
              <Text className="text-[#028758] text-base font-semibold">
                {section.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default SingleGroupSection