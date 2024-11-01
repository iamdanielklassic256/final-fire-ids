import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileDetail = () => {
	const [memberName, setMemberName] = useState("");
	const [member, setMember] = useState("");

	useEffect(() => {
		const fetchMemberData = async () => {
		  try {
			const memberData = await AsyncStorage.getItem("member");
			if (memberData) {
			  const member = JSON.parse(memberData);
			  const fullName = `${member.first_name} ${member.last_name}${member.other_name ? ` ${member.other_name}` : ''}`.trim();
			  setMemberName(fullName);
			  setMember(member)
			  // Check if phone is verified
			  if (!member.is_phone_verified) {
				setIsVerified(false);
				setShowVerificationModal(true);
			  }
			}
		  } catch (error) {
			console.error("Error fetching member data:", error);
		  }
		};
	
		fetchMemberData();
	
		
	  }, []);


	return (
		<View className="flex-row items-center ">
			<View className="w-16 h-16 bg-white rounded-full items-center justify-center">
				<Text className="text-2xl font-bold text-[#4a008f]">
					{ }
				</Text>
			</View>
			<View className="ml-4">
				<Text className="text-xl font-bold text-white">{memberName}</Text>
				<Text className="text-gray-200">{member.email ?? ''}</Text>
			</View>
		</View>
	)
}

export default ProfileDetail