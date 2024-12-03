import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	Dimensions,
	StyleSheet,
	Animated,
	TouchableOpacity,
	Alert,
	Modal,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { all_members_in_a_group, meeting_attendance_url } from '../../../api/api';
import EnhancedLoader from '../../../utils/EnhancedLoader';
import { Check, X, AlertTriangle } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EntityAttendanceEnum = {
	daily: 'present',
	absentwithapology: 'absent with apology',
	absentwithoutapology: 'absent without apology',
};

const statusColors = {
	[EntityAttendanceEnum.daily]: 'text-green-500',
	[EntityAttendanceEnum.absentwithapology]: 'text-yellow-500',
	[EntityAttendanceEnum.absentwithoutapology]: 'text-red-500',
};
const statusColor = {
	[EntityAttendanceEnum.daily]: 'bg-green-500',
	[EntityAttendanceEnum.absentwithapology]: 'bg-yellow-500',
	[EntityAttendanceEnum.absentwithoutapology]: 'bg-red-500',
};

const statusIcons = {
	[EntityAttendanceEnum.daily]: <Check color="green" size={24} />,
	[EntityAttendanceEnum.absentwithapology]: <AlertTriangle color="yellow" size={24} />,
	[EntityAttendanceEnum.absentwithoutapology]: <X color="red" size={24} />,
};



const transformAttendanceData = (attendanceArray) => {
	return attendanceArray.reduce((acc, item) => {
		acc[item.memberId] = {
			status: item.availalibilty,
			id: item.id
		};
		return acc;
	}, {});
};

const AttendanceSection = ({ meetingId, groupId, existingAttendance = [] }) => {
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [memberAttendance, setMemberAttendance] = useState({});
	const [selectedMember, setSelectedMember] = useState(null);
	const [updateMode, setUpdateMode] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	// Transform existing attendance array to object
	const transformedExistingAttendance = transformAttendanceData(existingAttendance);

	useEffect(() => {
		fetchAllGroupMembers();
	}, [groupId]);

	const fetchAllGroupMembers = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${all_members_in_a_group}/${groupId}`);
			if (response.ok) {
				const data = await response.json();
				setMembers(data?.members);
				const initialAttendance = data?.members.reduce((acc, member) => {
					const existingRecord = transformedExistingAttendance[member.id];
					acc[member.id] = {
						status: existingRecord?.status || EntityAttendanceEnum.daily,
						recordId: existingRecord?.id
					};
					return acc;
				}, {});
				setMemberAttendance(initialAttendance);
			} else {
				throw new Error('Failed to fetch group members');
			}
		} catch (error) {
			console.error('Error fetching group members:', error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const swipeDirectionToStatus = {
		left: EntityAttendanceEnum.absentwithoutapology,
		right: EntityAttendanceEnum.daily,
		center: EntityAttendanceEnum.absentwithapology,
	};

	const handleAttendanceSwipe = (memberId, direction) => {
		const newStatus = swipeDirectionToStatus[direction];
		if (newStatus) {
			setMemberAttendance((prev) => ({
				...prev,
				[memberId]: {
					...prev[memberId],
					status: newStatus
				}
			}));
		}
	};

	const submitAttendance = async () => {
		if (!selectedMember) {
			Alert.alert('Error', 'Please select a member');
			return;
		}

		try {
			setLoading(true);
			const attendanceRecord = memberAttendance[selectedMember.id];
			const payload = {
				meetingId,
				memberId: selectedMember.id,
				availalibilty: attendanceRecord.status,
			};

			const isUpdate = updateMode && attendanceRecord.recordId;
			const url = isUpdate
				? `${meeting_attendance_url}/${attendanceRecord.recordId}`
				: meeting_attendance_url;
			const method = isUpdate ? 'PATCH' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				const responseData = await response.json();
				Alert.alert(
					'Success',
					isUpdate
						? 'Attendance updated successfully'
						: 'Attendance submitted successfully'
				);

				// Update the record ID if it's a new submission
				if (!isUpdate) {
					setMemberAttendance(prev => ({
						...prev,
						[selectedMember.id]: {
							...prev[selectedMember.id],
							recordId: responseData.id
						}
					}));
				}

				setSelectedMember(null);
				setUpdateMode(false);
			} else {
				const errorData = await response.json();
				Alert.alert('Error', errorData.message || 'Failed to submit attendance');
			}
		} catch (error) {
			console.error('Submission error:', error);
			Alert.alert('Error', 'An error occurred during submission');
		} finally {
			setLoading(false);
		}
	};

	const handleLongPress = (member) => {
		setSelectedMember(member);
		setUpdateMode(true);
		setModalVisible(true);
	};

	const MemberAttendanceCard = ({ member }) => {
		const translateX = new Animated.Value(0);

		const onGestureEvent = Animated.event(
			[{ nativeEvent: { translationX: translateX } }],
			{ useNativeDriver: true }
		);

		const onHandlerStateChange = (event) => {
			if (event.nativeEvent.state === State.END) {
				const { translationX } = event.nativeEvent;
				if (translationX < -100) {
					handleAttendanceSwipe(member.id, 'left');
				} else if (translationX > 100) {
					handleAttendanceSwipe(member.id, 'right');
				} else {
					handleAttendanceSwipe(member.id, 'center');
				}
			}
		};

		// Get the current attendance status or set it to 'daily' as the default
		const attendanceStatus = memberAttendance[member.id]?.status || EntityAttendanceEnum.absentwithoutapology;
		// Determine background color based on the status
		const backgroundColor = statusColors[attendanceStatus] || 'text-gray-300';

		return (
			<TouchableOpacity
				onPress={() => setSelectedMember(member)}
				onLongPress={() => handleLongPress(member)}
				className={`${selectedMember?.id === member.id ? '' : ''}`}
			>
				<PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
					<Animated.View
						style={[
							styles.card,
							{
								transform: [{ translateX }],
							},
						]}
						className={`flex-row items-center p-4 mb-2 rounded-lg bg-[#111827] `}
					>
						<View className="flex-1">
							<Text className="text-white font-bold text-lg">{member.name}</Text>
							<Text className={`${backgroundColor}`}>{attendanceStatus}</Text>
						</View>
						{statusIcons[attendanceStatus]}
					</Animated.View>
				</PanGestureHandler>
			</TouchableOpacity>
		);
	};



	if (loading) {
		return <EnhancedLoader isLoading={loading} message="Loading..." />;
	}

	if (error) {
		return (
			<View className="flex-1 justify-center items-center">
				<Text className="text-red-500">{error}</Text>
			</View>
		);
	}

	return (
		<View className="p-4 relative">
			<Text className=" text-lg mb-4">Long press to add or update existing attendance</Text>
			<View className="bg-gray-100 p-3 rounded-lg mb-4">
				<View className="flex-row items-center mb-2">
					<Check color="green" size={20} />
					<Text className="ml-2">Green Check: Present</Text>
				</View>
				<View className="flex-row items-center mb-2">
					<AlertTriangle color="yellow" size={20} />
					<Text className="ml-2">Yellow Triangle: Absent with Apology</Text>
				</View>
				<View className="flex-row items-center">
					<X color="red" size={20} />
					<Text className="ml-2">Red Cross: Absent without Apology</Text>
				</View>
			</View>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible && updateMode}
				onRequestClose={() => {
					setModalVisible(false);
					setUpdateMode(false);
				}}
			>
				<View className="flex-1 justify-center items-center bg-black/50">
					<View className="bg-white p-6 rounded-lg w-[90%]">
						<Text className="text-xl font-bold mb-4">Update Attendance</Text>
						<Text className="mb-4">
							Current Status: {memberAttendance[selectedMember?.id]?.status}
						</Text>
						<View className="flex-col justify-between space-y-2">
							{Object.values(EntityAttendanceEnum).map((status) => (
								<TouchableOpacity
									key={status}
									onPress={() => {
										setMemberAttendance(prev => ({
											...prev,
											[selectedMember.id]: {
												...prev[selectedMember.id],
												status
											}
										}));
										setModalVisible(false);
										submitAttendance();
									}}
									className={`p-3 rounded-lg ${statusColor[status] || 'bg-gray-300'}`}
								>
									<Text className="text-white text-center">{status}</Text>
								</TouchableOpacity>
							))}
						</View>
						<TouchableOpacity
							onPress={() => {
								setModalVisible(false);
								setUpdateMode(false);
							}}
							className="mt-4 p-3 bg-gray-200 rounded-lg"
						>
							<Text className="text-center">Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<ScrollView className="mt-4">
				{members.map((member) => (
					<MemberAttendanceCard key={member.id} member={member} />
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		width: SCREEN_WIDTH - 32,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});

export default AttendanceSection;