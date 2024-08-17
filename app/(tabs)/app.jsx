import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Statistic from "../../components/app/Statistic";
import Activities from "../../components/app/Activities";

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const member = JSON.parse(memberData);
          const fullName = `${member.first_name} ${member.last_name}`;
          setMemberName(fullName);
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
    </View>
  );
};



export default Home;