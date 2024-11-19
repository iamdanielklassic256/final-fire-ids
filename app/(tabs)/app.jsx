import { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Statistic from "../../components/app/Statistic";
import Activities from "../../components/app/Activities";
import Logout from "../../components/app/Logout";
import VerificationModalCard from "../../components/auth/VerificationModalCard";

const Home = () => {
  const [memberData, setMemberData] = useState({
    fullName: "",
    isPhoneVerified: true,
     member: null
  });
  const [greeting, setGreeting] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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
        // Consider adding error handling UI feedback
      }
    };

    const setGreetingByTime = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 18) return 'Good Evening,';
      if (currentHour >= 12) return 'Good Afternoon,';
      return 'Good Morning,';
    };

    fetchMemberData();
    setGreeting(setGreetingByTime());
  }, []);

  const formatFullName = (member) => {
    return `${member.first_name} ${member.last_name}${member.other_name ? ` ${member.other_name}` : ''
      }`.trim();
  };

  const handleVerifyNow = () => {
    router.push("/verify-phone");
    setShowVerificationModal(false);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#028758] h-36 rounded-b-3xl">
        <View className="pt-16 px-4 flex flex-row justify-between items-center">
          <View>
            <Text className="text-white text-lg font-bold">
              {greeting}
            </Text>
            <Text className="text-white text-xl font-bold">
              {memberData.fullName}
            </Text>
          </View>
          <Logout />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <Statistic />
        <Activities />
      </ScrollView>

      {!memberData.member?.contact_verified && (
        <VerificationModalCard
          visible={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          onVerifyNow={handleVerifyNow}
          message='Please verify your phone number to continue using Akiba.'
        />
      )}
    </View>
  );
};

export default Home;



