import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const ActionButton = ({ icon, label, onPress }) => (
	<TouchableOpacity style={styles.actionButton} onPress={onPress}>
		<Ionicons name={icon} size={24} color="#00E394" />
		<Text style={styles.actionButtonText}>{label}</Text>
	</TouchableOpacity>
);


const styles = StyleSheet.create({
	actionButton: {
		alignItems: 'center',
	},
	actionButtonText: {
		marginTop: 5,
		color: '#333',
	},
});

export default ActionButton;