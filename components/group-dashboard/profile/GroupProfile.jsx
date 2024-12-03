import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { router } from 'expo-router'
import StepSection from '../../personal-account/StepSection'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import InterestMethodPickers from '../../personal-account/InterestMethodPickers'
import SavingCyclePickers from '../../personal-account/SavingCyclePickers'
import EnhancedLoader from '../../../utils/EnhancedLoader'
import StepIndicator from '../../group-creation/StepIndicator'
import { saving_group_url } from '../../../api/api'

const GroupProfile = ({ group }) => {

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

				const response = await axios.get(`${saving_group_url}/${group.id}`);
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
	}, [group?.id]);

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

			const response = await axios.patch(`${saving_group_url}/${group.id}`, requestData);

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
		<StepSection
			StepIndicator={StepIndicator}
			currentStep={currentStep}
			handleStepClick={handleStepClick}
			stepsCompleted={stepsCompleted}
		/>
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
			<InterestMethodPickers
				loanDetails={loanDetails}
				handleInputChange={handleInputChange}
			/>
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
				<SavingCyclePickers
					handleInputChange={handleInputChange}
					savingCycleDetails={savingCycleDetails}
					setDayToClosestDate={setDayToClosestDate}
					showStartDatePicker={showStartDatePicker}
					setShowStartDatePicker={setShowStartDatePicker}
					setShowShareoutDatePicker={setShowShareoutDatePicker}
					showShareoutDatePicker={showShareoutDatePicker}
				/>
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

	if (loading) {
		<EnhancedLoader isLoading={true} message='Loading group details...' />
	}



	return (
		<>
			{currentView === "steps" ? renderSteps() : renderStepContent()}
			{stepsCompleted && stepsCompleted.every((step) => step) && (
				<View className="fixed items-center justify-center bottom-2 left-0 right-0 px-14 mx-4 p-4 z-10 bg-[#111827] rounded-lg">
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
	)
}

export default GroupProfile