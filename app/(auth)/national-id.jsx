import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import PersonalInformation from '../../components/profile/PersonalInformation';

const NationalIdentificationNumber = () => {

	const [member, setMember] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchMemberData = async () => {
			try {
				const memberData = await AsyncStorage.getItem("member");
				if (memberData) {
					const parsedMember = JSON.parse(memberData);
					setMember(parsedMember);
				}
			} catch (error) {
				console.error("Error fetching member data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMemberData();
	}, []);

	// Sample data - replace with your actual data source
	const idData = {
		surname: "OKUMU",
		givenName: "DANIEL COMBONI",
		nationality: "UGANDAN",
		gender: "MALE",
		dateOfBirth: "1990-05-10",
		nin: "CM9900510ARC4C",
		cardNo: "001234567",
		dateOfExpiry: "2029-05-10",
		village: "KIREKA",
		parish: "KIRA",
		county: "KYADONDO EAST",
		district: "WAKISO"
	};

	

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<View style={styles.headerContent}>
						<Feather name="credit-card" size={32} color="#4a008f" />
						<Text style={styles.headerTitle}>National ID Information</Text>
					</View>
					<Text style={styles.subtitle}>Republic of Uganda</Text>
				</View>

				<PersonalInformation member={member} />

				{/* <View style={styles.section}>
					<Text style={styles.sectionTitle}>Card Details</Text>
					<InfoRow label="NIN" value={idData.nin} icon="hash" />
					<InfoRow label="Card Number" value={idData.cardNo} icon="credit-card" />
					<InfoRow label="Date of Expiry" value={idData.dateOfExpiry} icon="calendar" />
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Address Information</Text>
					<InfoRow label="Village" value={idData.village} icon="home" />
					<InfoRow label="Parish" value={idData.parish} icon="map-pin" />
					<InfoRow label="County" value={idData.county} icon="map" />
					<InfoRow label="District" value={idData.district} icon="navigation" />
				</View> */}

				<View style={styles.disclaimer}>
					<Feather name="info" size={20} color="#666" />
					<Text style={styles.disclaimerText}>
						This is an electronic representation of the National ID information.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		backgroundColor: '#fff',
		padding: 20,
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	headerContent: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#4a008f',
		marginLeft: 10,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		marginTop: 5,
	},
	section: {
		backgroundColor: '#fff',
		marginTop: 15,
		padding: 15,
		borderRadius: 10,
		marginHorizontal: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#4a008f',
		marginBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		paddingBottom: 5,
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f0e6ff',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	textContainer: {
		flex: 1,
	},
	label: {
		fontSize: 14,
		color: '#666',
		marginBottom: 2,
	},
	value: {
		fontSize: 16,
		color: '#333',
		fontWeight: '500',
	},
	disclaimer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		margin: 15,
		padding: 15,
		borderRadius: 10,
		borderLeftWidth: 4,
		borderLeftColor: '#4a008f',
	},
	disclaimerText: {
		flex: 1,
		marginLeft: 10,
		color: '#666',
		fontSize: 14,
	},
});

export default NationalIdentificationNumber;