import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { group_meeting_url, group_meetings_attendance_url } from '../../api/api';
import EnhancedLoader from '../../utils/EnhancedLoader';
import { StatusBar } from 'expo-status-bar';
import AkibaHeader from '../../components/AkibaHeader';
import AttendanceSection from '../../components/group-dashboard/meetings/AttendanceSection';

const GroupAttendance = () => {
  const { id } = useLocalSearchParams();
  const [attendance, setAttendance] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayError = (message) => {
    console.error(message);
    setError(message);
  };

  const fetchMeetingData = async () => {
    try {
      const [attendanceResponse, meetingResponse] = await Promise.all([
        fetch(`${group_meetings_attendance_url}/${id}`),
        fetch(`${group_meeting_url}/${id}`),
      ]);

      if (attendanceResponse.ok && meetingResponse.ok) {
        setAttendance(await attendanceResponse.json());
        setMeeting(await meetingResponse.json());
      } else {
        throw new Error('Failed to fetch meeting data');
      }
    } catch (error) {
      displayError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingData();
  }, [id]);

  if (loading) {
    return <EnhancedLoader isLoading={loading} message="Loading attendance..." />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" />
      <AkibaHeader
        title="Group Meeting Attendance"
        message="Tracking group meeting attendance"
        icon="arrow-back"
        color="white"
        handlePress={() => router.back()}
      />
      {attendance && meeting && (
        <AttendanceSection existingAttendance={attendance} meetingId={id} groupId={meeting.groupId} />
      )}
    </View>
  );
};

export default GroupAttendance;
