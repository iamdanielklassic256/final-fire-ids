import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { meeting_attendance_url } from '../../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';

const AttendanceModal = ({ isVisible, onClose, groupMeetingId, groupMembers }) => {
  console.log("group Meeting ID: Attendance Side", groupMeetingId);
  const [selectedMember, setSelectedMember] = useState(null);
  const [attendanceTime, setAttendanceTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    console.log("Current meeting_attendance_url:", meeting_attendance_url);
  }, []);

  const handleSubmit = async () => {
    console.log("Submitting attendance:", { groupMeetingId, selectedMember, attendanceTime });
    if (!selectedMember) {
      Alert.alert("Error", "Please select a member");
      return;
    }

    try {
      // Verify the URL
      if (!meeting_attendance_url) {
        throw new Error("The meeting_attendance_url is not defined");
      }

      const currentDate = new Date();
      const attendanceDateTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        attendanceTime.getHours(),
        attendanceTime.getMinutes()
      );

      const requestBody = {
        group_meeting_id: groupMeetingId,
        present_member_id: selectedMember?.id,
        arrival_time: attendanceDateTime.toISOString(),
      };

      console.log("*****Request URL:", meeting_attendance_url);
      console.log("Request body:", JSON.stringify(requestBody));

      const response = await fetch(meeting_attendance_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.log("Failed to parse response as JSON:", await response.text());
      }
      
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(`Failed to submit attendance: ${response.status} ${response.statusText}`);
      }

      Alert.alert("Success", "Attendance recorded successfully!");
      onClose();
    } catch (error) {
      console.error("Error recording attendance:", error);
      Alert.alert("Error", `Error recording attendance: ${error.message}\n\nPlease check the console for more details.`);
    }
  };

  const filteredMembers = groupMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.memberItem,
        selectedMember?.id === item.id && styles.selectedMemberItem
      ]}
      onPress={() => setSelectedMember(item)}
    >
      <Text style={styles.memberName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Record Attendance</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.sectionTitle}>All Members</Text>
          <FlatList
            data={filteredMembers}
            renderItem={renderMemberItem}
            keyExtractor={item => item.id.toString()}
            style={styles.memberList}
          />

          <View style={styles.timeContainer}>
            <TouchableOpacity style={styles.timePicker} onPress={() => setShowTimePicker(true)}>
              <Text>{attendanceTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={attendanceTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setAttendanceTime(selectedTime);
                }
              }}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSubmit]} onPress={handleSubmit}>
              <Text style={styles.textStyle}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: '90%',
		maxHeight: '90%',
	},
	modalTitle: {
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 24,
		fontWeight: 'bold',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'flex-start',
		marginTop: 10,
		marginBottom: 5,
	},
	searchInput: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 10,
		width: '100%',
	},
	recentAttendeesList: {
		maxHeight: 80,
		width: '100%',
	},
	recentAttendeeItem: {
		padding: 10,
		backgroundColor: '#f0f0f0',
		borderRadius: 10,
		marginRight: 10,
		minWidth: 100,
		alignItems: 'center',
	},
	recentAttendeeName: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	recentAttendeeDate: {
		fontSize: 12,
		color: '#666',
	},
	memberList: {
		maxHeight: 200,
		width: '100%',
	},
	memberItem: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	selectedMemberItem: {
		backgroundColor: '#e6e6e6',
	},
	memberName: {
		fontSize: 16,
	},
	timeContainer: {
		width: '100%',
		marginTop: 15,
	},
	timePicker: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		alignItems: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginTop: 20,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		minWidth: 100,
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	buttonSubmit: {
		backgroundColor: '#4CAF50',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default AttendanceModal;