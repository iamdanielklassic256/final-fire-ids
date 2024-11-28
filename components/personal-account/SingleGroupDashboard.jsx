import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Users, BookOpen, Award } from 'lucide-react-native'
import { useRouter } from 'expo-router'

const SingleGroupDashboard = ({ groupId, groupName }) => {
  const router = useRouter();

  const sections = [
    { 
      id: 'memberProfile', 
      label: 'Member Profile', 
      icon: Users,
      route: `member-profile/${groupId}`,
    },
    { 
      id: 'electOfficers', 
      label: 'Elect Officers', 
      icon: Award,
      route: `officers/${groupId}`,
    }
  ];

  return (
    <View className="mx-4 mt-4">
      <View className="mb-4">
        <Text className="text-xl font-bold text-gray-800 mb-3">{groupName}</Text>
      </View>
      
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

export default SingleGroupDashboard