import { View, Text, Modal, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

const VerificationModalCard = ({ visible, onClose, onVerifyNow, message }) => {
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<View style={styles.modalIcon}>
						<Ionicons name="warning-outline" size={50} color="#FFA500" />
					</View>

					<Text style={styles.modalTitle}>Verification Required</Text>

					<Text style={styles.modalMessage}>
						{message || "Please verify your phone number to access this feature."}
					</Text>

					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[styles.modalButton, styles.laterButton]}
							onPress={onClose}
						>
							<Text style={styles.laterButtonText}>Later</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.modalButton, styles.verifyButton]}
							onPress={onVerifyNow}
						>
							<Text style={styles.verifyButtonText}>Verify Now</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default VerificationModalCard


const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 20,
		width: '85%',
		alignItems: 'center',
		elevation: 5,
	},
	modalIcon: {
		marginBottom: 15,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333',
	},
	modalMessage: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 20,
		color: '#666',
		lineHeight: 22,
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 10,
	},
	modalButton: {
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 8,
		minWidth: '45%',
	},
	laterButton: {
		backgroundColor: '#f0f0f0',
	},
	verifyButton: {
		backgroundColor: '#028758',
	},
	laterButtonText: {
		color: '#666',
		fontSize: 16,
		textAlign: 'center',
	},
	verifyButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
})

