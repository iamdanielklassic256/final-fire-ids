import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path } from 'react-native-svg';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledTextInput = styled(TextInput)

const PiggyBankIcon = (props) => (
	<Svg width={40} height={40} viewBox="0 0 20 20" fill="currentColor" {...props}>
		<Path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
		<Path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
	</Svg>
);

const PlusIcon = (props) => (
	<Svg width={24} height={24} viewBox="0 0 20 20" fill="currentColor" {...props}>
		<Path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
	</Svg>
);

const ContributionFreq = () => {
	const [cycles, setCycles] = useState([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		setCycles([
			{ id: '1', name: 'Dream Vacation', description: 'Save $200 monthly for a tropical getaway', progress: 65 },
			{ id: '2', name: 'Emergency Fund', description: 'Build a safety net of $5000', progress: 40 },
			{ id: '3', name: 'New Gadget', description: 'Save for the latest tech release', progress: 85 },
		]);
	}, []);

	const handleCreateCycle = () => {
		if (name && description) {
			const newCycle = {
				id: Date.now().toString(),
				name,
				description,
				progress: 0,
			};
			setCycles([...cycles, newCycle]);
			setName('');
			setDescription('');
			setModalVisible(false);
		}
	};

	const renderCycleItem = ({ item }) => (
		<LinearGradient
			colors={['#4facfe', '#00f2fe']}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			className="rounded-xl p-4 mb-4"
		>
			<StyledText className="text-lg font-bold text-white mb-1">{item.name}</StyledText>
			<StyledText className="text-white mb-2">{item.description}</StyledText>
			<StyledView className="bg-white bg-opacity-30 h-2 rounded-full overflow-hidden">
				<StyledView className="bg-white h-full rounded-full" style={{ width: `${item.progress}%` }} />
			</StyledView>
			<StyledText className="text-white text-right mt-1">{item.progress}%</StyledText>
		</LinearGradient>
	);

	return (
		<StyledView className="flex-1 bg-blue-50">
			{/* <StyledView className="flex-row items-center justify-center p-4 bg-white border-b border-gray-200">
        <PiggyBankIcon className="text-blue-500 mr-2" />
        <StyledText className="text-2xl font-bold text-gray-800">Saving Cycles</StyledText>
      </StyledView> */}

			<FlatList
				data={cycles}
				renderItem={renderCycleItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ padding: 16 }}
			/>

			<StyledTouchableOpacity
				className="absolute right-4 bottom-4 w-14 h-14 rounded-full bg-blue-500 items-center justify-center"
				onPress={() => setModalVisible(true)}
			>
				<PlusIcon className="text-white" />
			</StyledTouchableOpacity>

			<Modal
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<StyledView className="flex-1 bg-black bg-opacity-50 justify-end">
					<StyledView className="bg-white rounded-t-3xl p-6">
						<StyledText className="text-2xl font-bold text-gray-800 mb-4 text-center">New Contribution Frequency</StyledText>
						<StyledTextInput
							className="bg-gray-100 p-4 rounded-lg mb-4"
							placeholder="Cycle Name"
							value={name}
							onChangeText={setName}
						/>
						<StyledTextInput
							className="bg-gray-100 p-4 rounded-lg mb-6"
							placeholder="Description"
							value={description}
							onChangeText={setDescription}
							multiline
						/>
						<StyledView className="flex-row justify-between">
							<StyledTouchableOpacity
								className="flex-1 bg-red-500 p-4 rounded-lg mr-2"
								onPress={() => setModalVisible(false)}
							>
								<StyledText className="text-center font-bold text-white">Cancel</StyledText>
							</StyledTouchableOpacity>
							<StyledTouchableOpacity
								className="flex-1 bg-blue-500 p-4 rounded-lg ml-2"
								onPress={handleCreateCycle}
							>
								<StyledText className="text-center font-bold text-white">Create Cycle</StyledText>
							</StyledTouchableOpacity>
						</StyledView>
					</StyledView>
				</StyledView>
			</Modal>
		</StyledView>
	);
};

export default ContributionFreq;