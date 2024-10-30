import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, ScrollView, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Statistic from "../../components/app/Statistic";
import Activities from "../../components/app/Activities";

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [memberName, setMemberName] = useState("");
  const [member, setMember] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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

    const currentHour = new Date().getHours();
    let greetingText = 'Good Morning,';

    if (currentHour >= 12 && currentHour < 18) {
      greetingText = 'Good Afternoon,';
    } else if (currentHour >= 18) {
      greetingText = 'Good Evening,';
    }
    setGreeting(greetingText);
  }, []);

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem("member");
      await AsyncStorage.removeItem("accessToken");
      router.push("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  console.log("memberName", member)

  const verifiedPhone = member?.contact_verified


  console.log('verified phone', verifiedPhone)

  const handleVerifyNow = () => {
    // Navigate to verification screen
    router.push("/verify-phone");
    setShowVerificationModal(false);
  };

  const VerificationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showVerificationModal}
      onRequestClose={() => setShowVerificationModal(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl w-[90%] max-w-sm">
          <View className="items-center mb-4">
            <Icon name="phone-alert" size={50} color="#028758" />
          </View>

          <Text className="text-xl font-bold text-center mb-2">
            Phone Verification Required
          </Text>

          <Text className="text-gray-600 text-center mb-6">
            Please verify your phone number to access all features of the application.
          </Text>

          <TouchableOpacity
            className="bg-[#028758] py-3 px-6 rounded-xl mb-3"
            onPress={handleVerifyNow}
          >
            <Text className="text-white text-center font-bold">
              Verify Now
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2"
            onPress={() => setShowVerificationModal(false)}
          >
            <Text className="text-gray-500 text-center">
              Remind Me Later
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#028758] h-36 rounded-b-3xl">
        <View className="pt-16 px-4 flex flex-row justify-between items-center">
          <View>
            <Text className="text-white text-lg font-bold">
              {greeting}
            </Text>
            <Text className="text-white text-xl font-bold">
              {memberName}
            </Text>
          </View>
          <TouchableOpacity className="items-center" onPress={handleLogOut}>
            <Icon name="logout" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <Statistic />
        <Activities />
      </ScrollView>


      {!verifiedPhone && (
        <VerificationModal />
      )}

    </View>
  );
};

export default Home;