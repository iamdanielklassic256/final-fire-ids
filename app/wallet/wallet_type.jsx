import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path } from 'react-native-svg';
import { styled } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { group_wallet_type_url, group_wallet_url, member_group_wallet_type_url } from '../../api/api';
import Loader from '../../components/Loader';


const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledTextInput = styled(TextInput)

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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

const WalletTypeScreen = () => {
	const [walletType, setWalletType] = useState([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [member, setMember] = useState("");
	const [editingWalletType, setEditingWalletType] = useState(null);
	const [animation] = useState(new Animated.Value(0));
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

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
			fetchGroupWalletTypes();
		}
	}, [memberId]);

	console.log('Member Id', memberId)


	const fetchGroupWalletTypes = async () => {
		try {
		  setIsLoading(true);
		  const response = await fetch(`${member_group_wallet_type_url}/${memberId}`);
		  const data = await response.json();
	  
		  if (response.status === 200 && data.data) {
			setWalletType(data.data);
		  } else if (response.status === 404) {
			// No wallet types found, set an empty array
			setWalletType([]);
			console.log(data.message); // Log the "No wallet types found" message
		  } else {
			throw new Error(data.message || 'Failed to fetch group wallet types');
		  }
		} catch (error) {
		  setError('Failed to fetch group wallet types. Please try again later.');
		  console.error('Error fetching group wallet types:', error);
		} finally {
		  setIsLoading(false);
		}
	  };

	const handleCreateNewWalletType = async () => {
		if (memberId && name && description) {
		  const newWalletType = { memberId, name, description };
		  try {
			const response = await fetch(group_wallet_type_url, {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(newWalletType),
			});
			if (!response.ok) throw new Error('Failed to create cycle');
			fetchGroupWalletTypes();
			setName('');
			setDescription('');
			setModalVisible(false);
		  } catch (error) {
			console.error('Error creating cycle:', error);
			Alert.alert('Error', 'Failed to create cycle. Please try again.');
		  }
		}
	  };
	
	  const handleUpdateWalletType = async () => {
		if (name && description && editingWalletType) {
		  setIsUpdating(true);
		  const updatedWalletType = { ...editingWalletType, name, description };
		  try {
			const response = await fetch(`${group_wallet_type_url}/${editingWalletType.id}`, {
			  method: 'PATCH',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify(updatedWalletType),
			});
			if (!response.ok) throw new Error('Failed to update cycle');
			fetchGroupWalletTypes();
			setName('');
			setDescription('');
			setModalVisible(false);
			setEditingWalletType(null);
		  } catch (error) {
			console.error('Error updating cycle:', error);
			Alert.alert('Error', 'Failed to update cycle. Please try again.');
		  } finally {
			setIsUpdating(false);
		  }
		}
	  };
	
	  const handleDeleteWalletType = async (id) => {
		setIsDeleting(true);
		try {
		  const response = await fetch(`${group_wallet_type_url}/${id}`, {
			method: 'DELETE',
		  });
		  if (!response.ok) throw new Error('Failed to delete cycle');
		  fetchGroupWalletTypes();
		} catch (error) {
		  console.error('Error deleting cycle:', error);
		  Alert.alert('Error', 'Failed to delete cycle. Please try again.');
		} finally {
		  setIsDeleting(false);
		}
	  };
	
	  const renderWalletTypeItem = ({ item, index }) => {
		const inputRange = [
		  -1,
		  0,
		  (walletType.length - index - 1) * 100,
		  (walletType.length - index) * 100
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
						setEditingWalletType(item);
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
							{ text: "Delete", onPress: () => handleDeleteWalletType(item.id) }
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
	  }

	  if (isLoading) {
		return <Loader isLoading={isLoading} />;
	  }
	
	  if (error) {
		return (
		  <StyledView className="flex-1 justify-center items-center bg-blue-50">
			<StyledText className="text-red-500 text-lg">{error}</StyledText>
			<StyledTouchableOpacity
			  className="mt-4 bg-blue-500 px-6 py-3 rounded-full"
			  onPress={fetchGroupWalletTypes}
			>
			  <StyledText className="text-white font-bold">Retry</StyledText>
			</StyledTouchableOpacity>
		  </StyledView>
		);
	  }

	  console.log('wallet type:', walletType);
	
	  return (
		<StyledView className="flex-1 bg-blue-50">
		  <StyledView className="bg-blue-600 p-6 rounded-b-3xl shadow-lg">
			<StyledText className="text-white text-opacity-80">
			This is the specific time frame during which the group will contribute savings. This period includes both a defined start date, when the savings begin, and an end date, when the savings period concludes. The group needs to decide on this duration, ensuring it aligns with their financial goals and commitments.
			</StyledText>
		  </StyledView>
	
		  <AnimatedFlatList
			data={walletType}
			renderItem={renderWalletTypeItem}
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
			  setEditingWalletType(null);
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
				<StyledText className="text-xl font-bold text-gray-800 mb-6 text-center">
				  {editingWalletType ? 'Edit Cycle' : 'New Wallet Type'}
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
					onPress={editingWalletType ? handleUpdateWalletType : handleCreateNewWalletType}
					disabled={isUpdating}
				  >
					<StyledText className="text-center font-bold text-white text-lg">
					  {editingWalletType ? (isUpdating ? <Loader isLoading={isUpdating}/> : 'Update') : 'Create'}
					</StyledText>
				  </StyledTouchableOpacity>
				</StyledView>
			  </StyledView>
			</StyledView>
		  </Modal>
		</StyledView>
	  );
}

export default WalletTypeScreen