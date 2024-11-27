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
import EnhancedLoader from '../../utils/EnhancedLoader';

const GroupProfile = () => {
  const { id } = useLocalSearchParams();
  
  const [currentView, setCurrentView] = useState("steps");
  const [currentStep, setCurrentStep] = useState(null);
  const [stepsCompleted, setStepsCompleted] = useState([false, false, false, false]);
  
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [member, setMember] = useState(null);
  
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

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showShareoutDatePicker, setShowShareoutDatePicker] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          setMember(JSON.parse(memberData));
        }

        const response = await axios.get(`${saving_group_url}/${id}`);
        const groupData = response.data;
        
        // Populate initial state with group data
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
          oneTimeInterestMethod: groupData.oneTimeInterestMethod || "",
          monthlyInterestMethod: groupData.monthlyInterestMethod || "",
          interestRate: groupData.interestRate.toString()
        });

        setSavingCycleDetails({
          saving_cycle_method: groupData.saving_cycle_method,
          saving_starting_day: groupData.saving_starting_day,
          start_date: new Date(groupData.start_date),
          shareout_date: new Date(groupData.shareout_date)
        });

        // Mark all steps as completed initially
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

  const validateStep = () => {
    const validations = [
      () => groupProfile.name && groupProfile.location && groupProfile.country,
      () => shareDetails.price_per_share && shareDetails.minimum_share && shareDetails.maximum_share,
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

  const handleStepComplete = () => {
    if (!validateStep()) return;
    const updatedSteps = [...stepsCompleted];
    updatedSteps[currentStep] = true;
    setStepsCompleted(updatedSteps);
    setCurrentView("steps");
    setCurrentStep(null);
  };

  const handleUpdateGroup = async () => {
    setUpdateLoading(true);
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

      const response = await axios.patch(`${saving_group_url}/${id}`, requestData);

      if (response.status === 200) {
        Alert.alert("Success", "Saving group updated successfully!");
      }
    } catch (error) {
      console.error("Group update error:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleStepClick = (index) => {
    if (index === 0 || stepsCompleted[index - 1]) {
      setCurrentStep(index);
      setCurrentView("stepContent");
    } else {
      Alert.alert("Step Locked", "Please complete the previous steps first.");
    }
  };
  // Rendering methods from previous component (renderSteps, renderStepContent) would be added here

  const renderSteps = () => (
    <ScrollView className="p-6">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Let's get your group ready to save!
        </Text>
        <Text className="text-gray-600">Complete these steps in order to set up your group</Text>
      </View>

      {group_creation_steps.map((step, index) => {
        const isLocked = index > 0 && !stepsCompleted[index - 1];

        return (
          <StepItem
            currentStep={currentStep}
            key={index}
            index={index}
            handleStepClick={handleStepClick}
            step={step}
            isLocked={isLocked}
            StepIndicator={StepIndicator}
            stepsCompleted={stepsCompleted}
          />

        );
      })}
    </ScrollView>
  );

  const renderStepContent = () => {
    const fields =
      currentStep === 0
        ? groupProfile
        : currentStep === 1
          ? shareDetails
          : currentStep === 2
            ? loanDetails
            : savingCycleDetails;

    const labels =
      currentStep === 0
        ? { name: "Group Name", location: "Location", country: "Country" }
        : currentStep === 1
          ? {
            price_per_share: "Price per Share",
            minimum_share: "Minimum Shares",
            maximum_share: "Maximum Shares",
          }
          : currentStep === 2
            ? {
              interate_method: "Interest Calculation Method",
              oneTimeInterestMethod: "One-Time Interest Method",
              monthlyInterestMethod: "Monthly Interest Method",
              interestCalculationType: "Calculation Type",
              interestRate: "Interest Rate (%)",
            }
            : {
              saving_cycle_method: "Saving Cycle Method",
              saving_starting_date: "Saving Starting Date",
              start_date: "Start Date",
              shareout_date: "Share-Out Date",
            };

    const renderInterestMethodPickers = () => (
      <>
        {/* Main Interest Method Picker */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Interest Calculation Method</Text>
          <Picker
            selectedValue={loanDetails.interate_method}
            onValueChange={(value) => handleInputChange("interate_method", value)}
          >
            <Picker.Item label="Select Method" value="" />
            <Picker.Item label="One-Time" value="one-time" />
            <Picker.Item label="Monthly" value="monthly" />
          </Picker>
        </View>

        {/* One-Time Method Specific Pickers */}
        {loanDetails.interate_method === "one-time" && (
          <>
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">One-Time Interest Method</Text>
              <Picker
                selectedValue={loanDetails.oneTimeInterestMethod}
                onValueChange={(value) => handleInputChange("oneTimeInterestMethod", value)}
              >
                <Picker.Item label="Select Option" value="" />
                <Picker.Item label="Added" value="added" />
                <Picker.Item label="Subtracted" value="subtracted" />
              </Picker>
            </View>
          </>
        )}

        {/* Monthly Method Specific Pickers */}
        {loanDetails.interate_method === "monthly" && (
          <>
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Monthly Interest Method</Text>
              <Picker
                selectedValue={loanDetails.monthlyInterestMethod}
                onValueChange={(value) => handleInputChange("monthlyInterestMethod", value)}
              >
                <Picker.Item label="Select Option" value="" />
                <Picker.Item label="Declining Balance" value="declining" />
                <Picker.Item label="Fixed Rate" value="fixed" />
              </Picker>
            </View>
          </>
        )}

        {/* Interest Rate Input */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Interest Rate (%)</Text>
          <TextInput
            value={loanDetails.interestRate}
            onChangeText={(value) => handleInputChange("interestRate", value)}
            placeholder="Enter Interest Rate"
            keyboardType="numeric"
            className="bg-white border border-gray-300 p-4 rounded-lg"
          />
        </View>
      </>
    );

    const renderSavingCyclePickers = () => {
      const getValidDates = (selectedDay) => {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let validDates = [];
        const selectedDayIndex = daysOfWeek.indexOf(selectedDay);
        for (let i = 0; i < 7; i++) {
          validDates.push(daysOfWeek[(i + selectedDayIndex) % 7]);
        }
        return validDates;
      };

      const setDayToClosestDate = (selectedDay) => {
        const validDates = getValidDates(selectedDay);
        const closestStartDate = new Date();
        const closestShareoutDate = new Date();

        // Adjust dates to be closest to the selected day
        const startDayOffset = (validDates.indexOf(savingCycleDetails.saving_starting_day) - new Date().getDay() + 7) % 7;
        const shareoutDayOffset = (validDates.indexOf(savingCycleDetails.saving_starting_day) - new Date().getDay() + 7) % 7;

        closestStartDate.setDate(closestStartDate.getDate() + startDayOffset);
        closestShareoutDate.setDate(closestShareoutDate.getDate() + shareoutDayOffset);

        setSavingCycleDetails({
          ...savingCycleDetails,
          start_date: closestStartDate,
          shareout_date: closestShareoutDate
        });
      };

      return (
        <>
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Saving Cycle Method</Text>
            <Picker
              selectedValue={savingCycleDetails.saving_cycle_method}
              onValueChange={(value) => handleInputChange("saving_cycle_method", value)}
            >
              <Picker.Item label="Select Cycle Method" value="" />
              <Picker.Item label="Daily" value="daily" />
              <Picker.Item label="Biweekly" value="biweekly" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Monthly" value="monthly" />
            </Picker>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Saving Cycle Start Day</Text>
            <Picker
              selectedValue={savingCycleDetails.saving_starting_day}
              onValueChange={(value) => {
                handleInputChange("saving_starting_day", value);
                // setDayToClosestDate(value); // Adjust dates based on the selected start day
              }}
            >
              <Picker.Item label="Select Day" value="" />
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                <Picker.Item key={index} label={day} value={day} />
              ))}
            </Picker>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Start Date</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} className={`bg-white border ${savingCycleDetails.start_date.toLocaleDateString() === savingCycleDetails.saving_starting_day ? 'bg-green-300' : 'border-gray-300'} p-4 rounded-lg`}>
              <Text>{savingCycleDetails.start_date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={savingCycleDetails.start_date}
                mode="date"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    handleInputChange("start_date", selectedDate);
                  }
                  setShowStartDatePicker(false);
                }}
              />
            )}
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Shareout Date</Text>
            <TouchableOpacity onPress={() => setShowShareoutDatePicker(true)} className={`bg-white border ${savingCycleDetails.shareout_date.toLocaleDateString() === savingCycleDetails.saving_starting_day ? 'bg-green-300' : 'border-gray-300'} p-4 rounded-lg`}>
              <Text>{savingCycleDetails.shareout_date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showShareoutDatePicker && (
              <DateTimePicker
                value={savingCycleDetails.shareout_date}
                mode="date"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    handleInputChange("shareout_date", selectedDate);
                  }
                  setShowShareoutDatePicker(false);
                }}
              />
            )}
          </View>
        </>
      );
    };


    return (
      <ScrollView className="p-6">
        {currentStep === 3 ? (
          renderSavingCyclePickers()
        ) : currentStep === 2 ? (
          renderInterestMethodPickers()
        ) : (
          Object.keys(fields).map((field) => (
            <View key={field} className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">{labels[field]}</Text>
              <TextInput
                value={fields[field]}
                onChangeText={(value) => handleInputChange(field, value)}
                placeholder={`Enter ${labels[field]}`}
                className="bg-white border border-gray-300 p-4 rounded-lg"
              />
            </View>
          ))
        )}

        <View className="mt-6 space-y-3">
          <TouchableOpacity
            className="bg-[#028758] p-4 rounded-lg shadow-sm"
            onPress={handleStepComplete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Next Step
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 p-4 rounded-lg"
            onPress={() => setCurrentView("steps")}
          >
            <Text className="text-white text-center font-medium">
              Previous Step
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };
  
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      <AkibaHeader
        title={`${groupProfile.name}`}
        message="Update your group details"
        icon="arrow-back"
        color="white"
        handlePress={() => router.back()}
      />
      {loading ? (
        <EnhancedLoader isLoading={true} message='Loading group details...' />
      ) : (
        <>
          {currentView === "steps" ? renderSteps() : renderStepContent()}
          {stepsCompleted && stepsCompleted.every((step) => step) && (
            <View className="fixed items-center justify-center bottom-10 left-0 right-0 px-14 mx-4 p-4 z-10 bg-[#111827] rounded-lg">
              <TouchableOpacity
                onPress={handleUpdateGroup}
                className=""
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {updateLoading ? <ActivityIndicator color="white" /> : "Update Saving Group"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default GroupProfile;