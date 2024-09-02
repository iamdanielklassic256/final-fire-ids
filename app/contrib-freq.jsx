import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path } from 'react-native-svg';
import { styled } from 'nativewind';
import Loader from '../components/Loader';
import { contrib_freq_url, member_contrib_freq_url } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledTextInput = styled(TextInput)

const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

const PlusIcon = (props) => (
  <Svg width={24} height={24} viewBox="0 0 20 20" fill="currentColor" {...props}>
    <Path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </Svg>
);

const EditIcon = (props) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" {...props}>
    <Path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </Svg>
);

const DeleteIcon = (props) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" {...props}>
    <Path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </Svg>
);

const ContributionFreq = () => {
  const [contributions, setContributions] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [member, setMember] = useState("");
  const [editingContribution, setEditingContribution] = useState(null);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const member = JSON.parse(memberData);
          setMember(member);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
  }, []);

  const memberId = member.id;

  useEffect(() => {
    if (memberId) {
      fetchCycles();
    }
  }, [memberId]);

  const fetchCycles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${member_contrib_freq_url}/${memberId}`);
      if (response.status === 200) {
        const data = await response.json();
        setContributions(data);
      } else {
        throw new Error('Failed to fetch cycles');
      }
    } catch (error) {
      setError('Failed to fetch cycles. Please try again later.');
      console.error('Error fetching cycles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCycle = async () => {
    if (name && description) {
      const newCycle = { memberId, name, description };
      try {
        const response = await fetch(contrib_freq_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCycle),
        });
        if (!response.ok) throw new Error('Failed to create cycle');
        fetchCycles();
        setName('');
        setDescription('');
        setModalVisible(false);
      } catch (error) {
        console.error('Error creating cycle:', error);
        Alert.alert('Error', 'Failed to create cycle. Please try again.');
      }
    }
  };

  const handleUpdateCycle = async () => {
    if (name && description && editingContribution) {
      const updatedCycle = { ...editingContribution, name, description };
      try {
        const response = await fetch(`${contrib_freq_url}/${editingContribution.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCycle),
        });
        if (!response.ok) throw new Error('Failed to update cycle');
        fetchCycles();
        setName('');
        setDescription('');
        setModalVisible(false);
        setEditingContribution(null);
      } catch (error) {
        console.error('Error updating cycle:', error);
        Alert.alert('Error', 'Failed to update cycle. Please try again.');
      }
    }
  };

  const handleDeleteCycle = async (id) => {
    try {
      const response = await fetch(`${contrib_freq_url}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete cycle');
      fetchCycles();
    } catch (error) {
      console.error('Error deleting cycle:', error);
      Alert.alert('Error', 'Failed to delete cycle. Please try again.');
    }
  };

  const renderCycleItem = ({ item, index }) => {
    const inputRange = [
      -1,
      0,
      (contributions.length - index - 1) * 100,
      (contributions.length - index) * 100
    ];
    const scale = animation.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0]
    });

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-xl p-4 mb-4 shadow-lg"
        >
          <StyledView className="flex-row justify-between items-center">
            <StyledView className="flex-1">
              <StyledText className="text-xl font-bold text-white mb-2">{item.name}</StyledText>
              <StyledText className="text-white text-opacity-80">{item.description}</StyledText>
            </StyledView>
            <StyledView className="flex-row">
              <StyledTouchableOpacity
                className="mr-3 bg-white bg-opacity-20 p-2 rounded-full"
                onPress={() => {
                  setEditingContribution(item);
                  setName(item.name);
                  setDescription(item.description);
                  setModalVisible(true);
                }}
              >
                <EditIcon className="text-green-500" />
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className="bg-white bg-opacity-20 p-2 rounded-full"
                onPress={() => {
                  Alert.alert(
                    "Delete Cycle",
                    "Are you sure you want to delete this cycle?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", onPress: () => handleDeleteCycle(item.id) }
                    ]
                  );
                }}
              >
                <DeleteIcon className="text-red-500" />
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  if (error) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-blue-50">
        <StyledText className="text-red-500 text-lg">{error}</StyledText>
        <StyledTouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-3 rounded-full"
          onPress={fetchCycles}
        >
          <StyledText className="text-white font-bold">Retry</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-blue-50">
      <StyledView className="bg-blue-600 p-6 rounded-b-3xl shadow-lg">
        {/* <StyledText className="text-3xl font-bold text-white mb-2">Contribution Cycles</StyledText> */}
        <StyledText className="text-white text-opacity-80">Manage your contribution frequencies</StyledText>
      </StyledView>

      <AnimatedFlatList
        data={contributions}
        renderItem={renderCycleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: animation } } }],
          { useNativeDriver: true }
        )}
      />

      <StyledTouchableOpacity
        className="absolute right-6 bottom-6 w-16 h-16 rounded-full bg-blue-500 items-center justify-center shadow-lg"
        style={{ elevation: 5 }}
        onPress={() => {
          setEditingContribution(null);
          setName('');
          setDescription('');
          setModalVisible(true);
        }}
      >
        <PlusIcon className="text-white" />
      </StyledTouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <StyledView className="flex-1 bg-black bg-opacity-50 justify-end">
          <StyledView className="bg-white rounded-t-3xl p-6">
            <StyledText className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {editingContribution ? 'Edit Cycle' : 'New Cycle'}
            </StyledText>
            <StyledTextInput
              className="bg-gray-100 p-4 rounded-xl mb-4 text-lg"
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <StyledTextInput
              className="bg-gray-100 p-4 rounded-xl mb-6 text-lg"
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
            <StyledView className="flex-row justify-between">
              <StyledTouchableOpacity
                className="flex-1 bg-red-500 p-4 rounded-xl mr-2"
                onPress={() => setModalVisible(false)}
              >
                <StyledText className="text-center font-bold text-white text-lg">Cancel</StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className="flex-1 bg-blue-500 p-4 rounded-xl ml-2"
                onPress={editingContribution ? handleUpdateCycle : handleCreateCycle}
              >
                <StyledText className="text-center font-bold text-white text-lg">
                  {editingContribution ? 'Update' : 'Create'}
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
};

export default ContributionFreq;