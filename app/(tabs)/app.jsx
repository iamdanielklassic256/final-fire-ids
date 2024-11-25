import { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import Statistic from "../../components/app/Statistic";
import Activities from "../../components/app/Activities";
import Logout from "../../components/app/Logout";
import VerificationModalCard from "../../components/auth/VerificationModalCard";
import AkibaHeader from '../../components/AkibaHeader';
import SavingOverview from "../../components/personal-account/SavingOverview";
import GroupCreationCard from "../../components/personal-account/GroupCreationCard";
import DeleteAccount from "../../components/personal-account/DeleteAccount";
import FindGroup from "../../components/personal-account/FindGroup";

const Home = () => {
  const [memberData, setMemberData] = useState({
    fullName: "",
    isPhoneVerified: true,
    member: null
  });
  const [greeting, setGreeting] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [savingsData, setSavingsData] = useState({
    totalSavings: 0,
    personalSavings: 0,
    groupSavings: 0,
    totalGroups: 0
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const storedMemberData = await AsyncStorage.getItem("member");
        if (storedMemberData) {
          const member = JSON.parse(storedMemberData);
          const fullName = formatFullName(member);

          setMemberData({
            fullName,
            isPhoneVerified: member.is_phone_verified,
            member
          });

          if (!member.is_phone_verified) {
            setShowVerificationModal(true);
          }
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    const setGreetingByTime = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 18) return 'Good Evening,';
      if (currentHour >= 12) return 'Good Afternoon,';
      return 'Good Morning,';
    };

    // Mock function to fetch savings data
    const fetchSavingsData = async () => {
      // This would typically be an API call
      setSavingsData({
        totalSavings: 125000,
        personalSavings: 75000,
        groupSavings: 50000,
        totalGroups: 3
      });
    };

    fetchMemberData();
    fetchSavingsData();
    setGreeting(setGreetingByTime());
  }, []);

  const formatFullName = (member) => {
    return `${member.first_name} ${member.last_name}${member.other_name ? ` ${member.other_name}` : ''}`.trim();
  };

  const handleVerifyNow = () => {
    router.push("/verify-phone");
    setShowVerificationModal(false);
  };



  

  return (
    <View className=" flex-1 bg-gray-100">
      <AkibaHeader
        message={memberData.fullName}
        title={greeting}
      />

      <ScrollView className=" flex-1 px-4 pt-6">
        <SavingOverview
          savingsData={savingsData}
        />

        {/* GroupCreationCard */}
        <GroupCreationCard />

        {/* Current Groups Summary */}
        <FindGroup />

        <View className="">
          <View className="bg-red-500 p-2 flex-row justify-center items-center mt-6 rounded-lg">
            <Logout />
          </View>
          <DeleteAccount />
        </View>
      </ScrollView>

      {!memberData.member?.contact_verified && (
        <VerificationModalCard
          visible={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          onVerifyNow={handleVerifyNow}
          message='Please verify your phone number to continue using the SACCO app.'
        />
      )}
    </View>
  );
};

export default Home;