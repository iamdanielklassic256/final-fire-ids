import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { saving_group_url } from '../../api/api';
import AkibaHeader from '../../components/AkibaHeader';
import StepIndicator from '../../components/group-creation/StepIndicator';
import StepItem from '../../components/group-creation/StepItem';
import { group_creation_steps } from '../../data/data';

const GroupProfile = () => {
  const { id } = useLocalSearchParams();
  
  // State for group details
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);

  // State for form management
  const [currentView, setCurrentView] = useState("steps");
  const [currentStep, setCurrentStep] = useState(null);
  const [stepsCompleted, setStepsCompleted] = useState([false, false, false, false]);

  // State for different sections of group details
  const [groupProfile, setGroupProfile] = useState({
    name: "",
    location: "",
    country: "",
  });

  const [shareDetails, setShareDetails] = useState({
    price_per_share: "",
    minimum_share: "",
    maximum_share: "",
  });

  const [loanDetails, setLoanDetails] = useState({
    interate_method: "",
    oneTimeInterestMethod: "",
    monthlyInterestMethod: "",
    interestCalculationType: "",
    interestRate: "",
  });

  const [savingCycleDetails, setSavingCycleDetails] = useState({
    saving_cycle_method: "",
    saving_starting_day: "",
    start_date: new Date(),
    shareout_date: new Date(),
  });

  // Fetch group details on component mount
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        // Fetch member data
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          setMember(JSON.parse(memberData));
        }

        // Fetch group details
        const response = await axios.get(`${saving_group_url}/${id}`);
        const groupData = response.data;
        
        setGroup(groupData);

        // Populate initial state with existing group details
        setGroupProfile({
          name: groupData.name,
          location: groupData.location,
          country: groupData.country
        });

        setShareDetails({
          price_per_share: groupData.price_per_share.toString(),
          minimum_share: groupData.minimum_share.toString(),
          maximum_share: groupData.maximum_share.toString()
        });

        setLoanDetails({
          interate_method: groupData.interate_method,
          oneTimeInterestMethod: groupData.oneTimeInterestMethod || '',
          monthlyInterestMethod: groupData.monthlyInterestMethod || '',
          interestRate: groupData.interestRate.toString()
        });

        setSavingCycleDetails({
          saving_cycle_method: groupData.saving_cycle_method,
          saving_starting_day: groupData.saving_starting_day,
          start_date: new Date(groupData.start_date),
          shareout_date: new Date(groupData.shareout_date)
        });

        // Mark all steps as completed for update
        setStepsCompleted([true, true, true, true]);
      } catch (error) {
        console.error("Error fetching group details:", error);
        Alert.alert("Error", "Failed to load group details");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);

  // Existing input change handler from create group
  const handleInputChange = (field, value) => {
    switch (currentStep) {
      case 0:
        setGroupProfile({ ...groupProfile, [field]: value });
        break;
      case 1:
        setShareDetails({ ...shareDetails, [field]: value });
        break;
      case 2:
        setLoanDetails(prevDetails => {
          if (field === 'interate_method') {
            return {
              ...prevDetails,
              interate_method: value,
              oneTimeInterestMethod: '',
              monthlyInterestMethod: '',
              interestCalculationType: '',
              interestRate: ''
            };
          }
          return { ...prevDetails, [field]: value };
        });
        break;
      case 3:
        setSavingCycleDetails({ ...savingCycleDetails, [field]: value });
        break;
    }
  };

  // Validation method (similar to create group)
  const validateStep = () => {
    const validations = [
      () => {
        const { name, location, country } = groupProfile;
        return name && location && country;
      },
      () => {
        const { price_per_share, minimum_share, maximum_share } = shareDetails;
        return price_per_share && minimum_share && maximum_share;
      },
      () => {
        const { interate_method, interestRate } = loanDetails;
        const isValidOneTime = interate_method === "one-time" && loanDetails.oneTimeInterestMethod;
        const isValidMonthly = interate_method === "monthly" && loanDetails.monthlyInterestMethod;
        return interestRate && (isValidOneTime || isValidMonthly);
      },
      () => {
        const { saving_cycle_method, saving_starting_day, start_date, shareout_date } = savingCycleDetails;
        return saving_cycle_method && saving_starting_day && start_date && shareout_date;
      },
    ];

    if (!validations[currentStep]()) {
      Alert.alert("Error", "Please complete all fields in this step.");
      return false;
    }
    return true;
  };

  // Update group method
  const handleUpdateGroup = async () => {
    setLoading(true);
    try {
      const requestData = {
        staffId: member.id,
        name: groupProfile.name,
        location: groupProfile.location,
        country: groupProfile.country,
        price_per_share: shareDetails.price_per_share,
        minimum_share: shareDetails.minimum_share,
        maximum_share: shareDetails.maximum_share,
        interate_method: loanDetails.interate_method,
        oneTimeInterestMethod: loanDetails?.oneTimeInterestMethod || null,
        monthlyInterestMethod: loanDetails?.monthlyInterestMethod || null,
        interestRate: loanDetails.interestRate,
        saving_cycle_method: savingCycleDetails.saving_cycle_method,
        saving_starting_day: savingCycleDetails.saving_starting_day,
        start_date: savingCycleDetails.start_date,
        shareout_date: savingCycleDetails.shareout_date,
      };

      console.log("Updating group data:", requestData);

      const response = await axios.put(`${saving_group_url}/${id}`, requestData);

      if (response.status === 200) {
        Alert.alert("Success", "Saving group updated successfully!");
        router.push('/group/view-all');
      }
    } catch (error) {
      console.error("Group update error:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Existing step and form rendering methods remain the same as in create group
  // You can reuse renderSteps() and renderStepContent() from the create group component

  // If loading, show loading indicator
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#028758" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      <AkibaHeader
        title="Update Saving Group"
        message="Modify your group details"
        icon="arrow-back"
        color="white"
        handlePress={() => router.back()}
      />
      {currentView === "steps" ? renderSteps() :
        currentView === "locked-step" ? (
          <>
            {renderSteps()}
            <LockedStepMessage />
          </>
        ) : (
          <>
            {renderStepContent()}
          </>
        )}
      
      {stepsCompleted && stepsCompleted.every((step) => step) && (
        <View className="fixed items-center justify-center bottom-10 left-0 right-0 px-14 mx-4 p-4 z-10 bg-[#111827] rounded-lg">
          <TouchableOpacity
            onPress={handleUpdateGroup}
            className="bg-blue-500 p-4 rounded-lg mt-8"
          >
            <Text className="text-white text-center font-semibold text-lg">Update Group</Text>
          </TouchableOpacity>
        </View>
      )} 
    </View>
  );
};

export default GroupProfile;